import babel from 'rollup-plugin-babel';

const plugins = [
    babel({ exclude: '**/node_modules/**' })
];

export default [
    {
        input: 'src/core.js',
        output: { file: 'dist/core.js', format: 'umd', name: 'Core' },
        plugins
    }
];
