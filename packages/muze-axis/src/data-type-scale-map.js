import * as ScaleType from './enums/scale-type';

const DATA_TYPES = {
    DIMENSION: 'dimension',
    CATEGORICAL: 'categorical',
    MEASURE: 'measure',
    DATETIME: 'temporal'
};

/**
 * Map of DataModel types to associated field types.
 */
export const dataTypeScaleMap = {
    [DATA_TYPES.DIMENSION]: ScaleType.BAND,
    [DATA_TYPES.MEASURE]: ScaleType.LINEAR,
    [DATA_TYPES.DATETIME]: ScaleType.TIME
};

