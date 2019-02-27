import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pjson from 'rollup-plugin-json';

export default [
    {
        // server build
        input: 'src/core.js',
        external: ['fs', 'bufferutil', 'utf-8-validate'],
        output: { file: 'dist/core.js', format: 'umd', name: 'Core', },
        plugins: [
            resolve(),
            babel({ exclude: '**/node_modules/**' }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    },
    {
        input: 'src/core.js',
        output: { file: 'dist/client/core.js', format: 'umd', name: 'Core' },
        plugins: [
            builtins(),
            resolve(),
            babel({ exclude: '**/node_modules/**' }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    }
];
