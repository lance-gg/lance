import pjson from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        // server build
        input: 'src/package/serverExports.js',
        external: ['fs', 'bufferutil', 'utf-8-validate'],
        output: { file: 'dist/server/lance-gg.js', format: 'esm', name: 'Server' },
        plugins: [
            resolve(),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    },
    {
        // client build
        input: 'src/package/clientExports.js',
        output: { file: 'dist/client/lance-gg.js', format: 'umd', name: 'Client' },
        plugins: [
            resolve({ browser: true, preferBuiltins: false }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    }
];
