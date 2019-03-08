import pjson from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
    {
        // server build transpiled
        input: 'src/package/serverExports.js',
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
        // server build non-transpiled with es2015 modules
        input: 'src/package/serverExports.js',
        external: ['fs', 'bufferutil', 'utf-8-validate'],
        output: { file: 'dist/server-module/lance-gg.js', format: 'esm', name: 'Server' },
        plugins: [
            resolve(),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    },
    {
        // client build transpiled
        input: 'src/package/clientExports.js',
        output: { file: 'dist/client/lance-gg.js', format: 'umd', name: 'Client' },
        plugins: [
            resolve({ browser: true, preferBuiltins: false }),
            babel({ exclude: '**/node_modules/**' }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    },
    {
        // client build non-transpiled with es2015 modules
        input: 'src/package/clientExports.js',
        output: { file: 'dist/client-module/lance-gg.js', format: 'umd', name: 'Client' },
        plugins: [
            resolve({ browser: true, preferBuiltins: false }),
            pjson(),
            commonjs({ include: 'node_modules/**', extensions: ['.js'] })
        ]
    }

];
