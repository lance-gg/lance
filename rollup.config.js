import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pjson from 'rollup-plugin-json';

const plugins = [
    builtins(),
    resolve(),
    babel({ exclude: '**/node_modules/**' }),
    pjson(),
    commonjs({ include: 'node_modules/**', extensions: ['.js'] })
];

export default [
    {
        input: 'src/core.js',
        external: ['fs'],
        output: { file: 'dist/core.js', format: 'umd', name: 'Core' },
        plugins
    }
];
