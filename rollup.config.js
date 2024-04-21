import typescript from '@rollup/plugin-typescript';
import pjson from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

export default [
    {
        // server build non-transpiled with es2015 modules
        input: 'src/package/serverExports.ts',
        external: ['fs', 'bufferutil', 'utf-8-validate'],
        output: { file: 'dist/server/lance-gg.js', format: 'esm', name: 'Server' },
        plugins: [resolve(), typescript(), pjson(), commonjs({ include: 'node_modules/**' })]
    },
    {
        // client build non-transpiled with es2015 modules
        input: 'src/package/clientExports.ts',
        output: { file: 'dist/client/lance-gg.js', format: 'esm', name: 'Client' },
        plugins: [resolve({ browser: true, preferBuiltins: false }), typescript(), pjson(), commonjs({ include: 'node_modules/**' })]
    },
    {
        // types only
        input: ['src/package/allExports.ts'],
        output: { file: "dist/types/lance-gg.d.ts", format: "es" },
        plugins: [dts()]
    }
]
