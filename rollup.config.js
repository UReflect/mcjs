export default [
    {
        input: 'src/index.js',
        output: {
            name: 'MC',
            file: 'dist/mc.js',
            format: 'cjs'
        }
    },
    {
        input: 'src/index.js',
        output: {
            name: 'MC',
            file: 'dist/mc_test.js',
            format: 'iife'
        }
    }
]