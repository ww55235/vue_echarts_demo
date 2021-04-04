module.exports = {
    devServer: {
        port: 8887,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}