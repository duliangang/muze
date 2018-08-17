import { assembleModelFromIdentifiers, getDataModelFromRange } from 'muze-utils';
import { propagationBehaviourMap } from './action-behaviour-map';
import { propagationSideEffects } from './behaviour-effect-map';
import { STEP, GRADIENT } from '../enums/constants';

export const propagate = (firebolt, action, selectionSet, config = {}) => {
    let propagationData;
    const type = firebolt.context.constructor.type();
    const payload = config.payload;
    const data = firebolt.context.data();
    const metaData = firebolt.context.metaData();
    const propPayload = {};
    const sourceId = firebolt.context._id;
    propPayload.action = propagationBehaviourMap[action] || action;
    propPayload.sideEffects = propagationSideEffects[action];

    const isMutableAction = firebolt._actions.behavioural[propPayload.action].constructor.mutates();
    if (payload.criteria === null) {
        propagationData = null;
    } else {
        const entrySet = selectionSet.mergedEnter;
        let values = data.filter(d => entrySet.uids.indexOf(d.id) !== -1).map(d => d.value);
        if (type === STEP) {
            const field = Object.keys(payload.criteria || {})[0];
            values = data.filter(d => entrySet.uids.indexOf(d.id) !== -1).map(d => d.range);
            propagationData = metaData.select((fields) => {
                let check = false;
                for (let i = 0; i < values.length; i++) {
                    check = fields[field].value >= values[i][0] && fields[field].value <= values[i][1];
                    if (check === true) {
                        break;
                    }
                }
                return check;
            }, {
                saveChild: false
            });
        } else if (type === GRADIENT) {
            propagationData = getDataModelFromRange(metaData, payload.criteria);
        } else if (values.length) {
            propagationData = assembleModelFromIdentifiers(metaData, [payload.criteria[0], ...values.map(d => [d])]);
        } else {
            propPayload.criteria = null;
            propagationData = metaData.select(() => true, {
                saveChild: false
            });
        }
    }

    metaData.addToPropNamespace(`legend-${sourceId}`, propPayload, propPayload.criteria === null ?
            null : propagationData, isMutableAction);
    metaData.propagate(propagationData, propPayload, {
        isMutableAction,
        sourceId
    });
};