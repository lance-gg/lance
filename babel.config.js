module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                exclude: ['transform-regenerator', 'transform-async-to-generator'],
            },
        ]
    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-modules-commonjs'],
        },
    },
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    'lance-gg': './src',
                },
            },
        ],
        '@babel/plugin-proposal-class-properties',
    ]
};
