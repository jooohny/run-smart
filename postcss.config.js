module.exports = {
    plugins: [
        require('postcss-uncss')({
            html: ['src/index.html'],
        }),
        require('cssnano')({
            preset: 'default',
        }),
    ]
}