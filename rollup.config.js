export default [
    {
        input: 'src/MC.js',
        output: {
            name: 'MC',
            file: 'dist/mc.js',
            format: 'cjs'
        }
    },
    {
        input: 'src/MC.js',
        output: {
            name: 'MC',
            file: 'dist/mc_test.js',
            format: 'iife'
        }
    }
]