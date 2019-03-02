import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pjson from 'rollup-plugin-json';

export default [
    {
        // server build
        input: 'src/server.js',
        external: ['fs', 'bufferutil', 'utf-8-validate'],
        output: { file: 'dist/server/lance-gg.js', format: 'cjs', name: 'Server' },
        plugins: [
            resolve(),
            babel({ exclude: '**/node_modules/**' }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    },
    {
        input: 'src/client.js',
        output: { file: 'dist/client/lance-gg.js', format: 'umd', name: 'Client' },
        plugins: [
            // builtins(),
            resolve({ browser: true, preferBuiltins: false }),
            babel({ exclude: '**/node_modules/**' }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    }
];
