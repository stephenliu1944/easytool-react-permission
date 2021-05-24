module.exports = function(api) {
    api.cache(true);
    
    var presets = [
        ['@babel/preset-env', {
            'targets': [
                'last 2 version',
                'ie >= 10'
            ]
        }],
        '@babel/preset-react'
    ];
    var plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-optional-chaining',
        ['@babel/plugin-proposal-pipeline-operator', { 
            'proposal': 'minimal' 
        }],
        ['babel-plugin-module-resolver', {
            alias: {
                'Constants': './src/constants',
                'Utils': './src/utils'
            }
        }]
    ];

    switch (process.env.NODE_ENV) {
        case 'development':
            break;
        case 'link':
            break;
        case 'production':
            break;
        case 'test':
            break;
    }

    return {
        presets,
        plugins
    };
};