const { override, addWebpackAlias, fixBabelImports, overrideDevServer } = require('customize-cra')
const path = require('path')
const paths = require('react-scripts/config/paths')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// 打包文件夹重命名
paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist')

// 服务代理跨域
const devServerConfig = () => config => {
    // 判断环境变量执行对应地址代理
    const REACT_APP_BASE = () => {
        // 环境变量
        const env = process.env.REACT_APP_ENV
        // 代理域名
        if (env === 'dev') {
            return 'http://172.28.14.210:3061'
        } else if (env === 'qa') {
            return 'https://www.fastmock.site'
        } else if (env === 'uat') {
            return 'https://www.fastmock.site'
        } else {
            return 'https://www.fastmock.site'
        }
    }
    return {
        ...config,
        compress: true,
        proxy: {
            '/api': {
                target: 'http://172.28.14.210:3061', //要跨域的域名
                ws: true, // 是否启用websockets
                changeOrigin: true, //是否允许跨越
                // pathRewrite: {
                //     '^/gateway': ''  //将你的地址代理位这个 /api 接下来请求时就使用这个/api来代替你的地址
                // },
            }
        }
    }
}

module.exports = {
    webpack: override(
        addWebpackAlias({
            '@': path.relative(__dirname, 'src')
        }),
        fixBabelImports("import",{
            libraryName:'antd',  //库名
            libraryDirectory:'es', //文件夹名
            style:'index'  //一个叫css.js的文件
        }),
        // 改写webpack打包规则
        config => {
            const isEnvProduction = process.env.NODE_ENV === 'production'
            const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile')
            const terserPlugins = new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                        drop_console: process.env.NODE_ENV === "production", // 生产环境下移除控制台所有的内容
                        drop_debugger: false, // 移除断点
                        pure_funcs: process.env.NODE_ENV === "production" ? ["console.log"] : "", // 生产环境下移除console
                    },
                    mangle: {
                        safari10: true,
                    },
                    keep_classnames: isEnvProductionProfile,
                    keep_fnames: isEnvProductionProfile,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,            //此处为新增配置
                extractComments: false,    //此处为新增配置
            })
            // 打包去除 .LICENSE.txt
            config.optimization.minimizer = [terserPlugins, new CssMinimizerPlugin()]
            // 打包去除 asset-manifest.json
            config.plugins = config.plugins.filter(key => !(key.options && key.options.fileName === 'asset-manifest.json'))
            return config
        }
    ),
    devServer: overrideDevServer(devServerConfig())
}