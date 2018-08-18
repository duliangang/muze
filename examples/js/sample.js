(function () {
    let env = muze();
    let DataModel = muze.DataModel,
        share = muze.operators.share,
        html = muze.operators.html,
        actionModel = muze.ActionModel;
    layerFactory = muze.layerFactory;
    const SpawnableSideEffect = muze.SideEffects.SpawnableSideEffect;

    d3.json('../../data/cars.json', (data) => {
        const jsonData = data,
            // schema = [{
            //     name: 'date',
            //     type: 'dimension',
            //     subtype: 'temporal',
            //     format: '%Y/%m/%d'
            // }, {
            //     name: 'temp_max',
            //     type: 'measure'
            // }];
            schema = [{
                name: 'Name',
                type: 'dimension'
            },
            {
                name: 'Maker',
                type: 'dimension'
            },
            {
                name: 'Miles_per_Gallon',
                type: 'measure'
            },

            {
                name: 'Displacement',
                type: 'measure'
            },
            {
                name: 'Horsepower',
                type: 'measure'
            },
            {
                name: 'Weight_in_lbs',
                type: 'measure',
            },
            {
                name: 'Acceleration',
                type: 'measure',
            },
            {
                name: 'Origin',
                type: 'dimension'
            },
            {
                name: 'Cylinders',
                type: 'dimension'
            },
            {
                name: 'Year',
                type: 'dimension',
                // subtype: 'temporal',
                // format: '%Y-%m-%d'
            },
            ];

        layerFactory.composeLayers('heatMapText', [
            {
                name: 'bar',
                mark: 'bar',
                encoding: {
                    y: 'heatMapText.encoding.y',
                    x: 'heatMapText.encoding.x',
                },
            },
            {
                name: 'text',
                mark: 'text',
                encoding: {
                    x: 'heatMapText.encoding.x',
                    y: 'heatMapText.encoding.y',
                    text: 'heatMapText.encoding.text',
                    color: 'heatMapText.encoding.color',
                },
            },
        ]);
        let rootData = new DataModel(jsonData, schema);

        rootData = rootData.groupBy(['Year', 'Origin', 'Maker'], {
            Horsepower: 'mean',
            Acceleration: 'mean'
        });
        env = env.data(rootData).minUnitHeight(40).minUnitWidth(40);
        const mountPoint = document.getElementById('chart');
        window.canvas = env.canvas();
        let rows = ['Displacement', 'Horsepower'],
            columns = rows.reverse();

        canvas = canvas
            .rows(rows)
            .columns(columns)
            .data(rootData)
            .width(600)
            .height(450)
            .config({
                gridLines: {
                    y: {
                        show: true
                    }
                },
                facetConfig: {
                    rows: {
                        verticalAlign: 'middle',
                    }
                },
                border: {
                    width: 2,
                },
                axes: {
                    x: {
                        showAxisName: true,
                        exponent: 2,
                        base: 10,
                        showInnerTicks: true,

                    },
                    y: {
                        showAxisName: true,

                    },
                }
            })
            .color({
                field: 'Acceleration',
                interpolate: true
            })
            .legend({
                align: 'horizontal',

                position: 'top',
                item: {
                    text: {
                        position: 'left'
                    }
                },
            })

                        .title('The Muze Project', { position: 'top', align: 'left', })
                        .subtitle('Composable visualisations with a data first approach', { position: 'top', align: 'left' })
                        .mount(document.getElementsByTagName('body')[0]);
    });
}());
