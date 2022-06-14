import axios from 'axios'
import { delCookie } from '@/utils/common'
import { message } from 'antd'

// 创建服务
const service = axios.create({
    baseURL: `/api`,
    timeout: 8000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 统一注入token
        // 获取token
        const cookie = document.cookie.split('; ')
        for (let i = 0; i < cookie.length; i++) {
            let _cookie = cookie[i].split('=')
            if (_cookie[0] === 'token' && _cookie[1]) {
                const headers: any = config.headers
                headers.Authorization = `Bearer ${_cookie[1]}`
            }
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
  )
  
// 响应拦截器
service.interceptors.response.use(
    // 请求成功处理器
    res => {
        const { status, data } = res
        // 判断当前请求是否成功
        if (status === 200) {
            // 成功返回解析后的数据
            return res.data
        } else {
            // 失败（请求成功，业务失败），消息提示
            message.error(data.message)
        }
    },
    // 请求失败处理器
    err => {
        const { headers, method, url, data } = err.config
        const { status } = err.request
        // 输出错误信息
        message.error(err.response.data.message || err.message)
        if (status === 401) {
            // token错误、删除token重新登录
            delCookie('token')
        }
        // if (status === 404) {
        //     message.error(`${status}-接口不存在`)
        // } else if (status === 504) {
        //     message.error(`${status}-网关超时`)
        // }
        // console.log({...err})
        // 超时重试2次后还不行再返回错误数据
        if (err.message && err.message.indexOf('timeout') >= 0 && err.request) {
            const OVER_TIME: any = {},
                key = `${method}${url}`
            // 将请求方法及url作为key，记录对应请求超时次数
            OVER_TIME[key] = OVER_TIME[key] ? ++OVER_TIME[key] : 1
            // 重试一次
            if (OVER_TIME[key] <= 2) {
                // 使用上次请求的配置重新请求
                console.error(`${url} 请求超时，进行重试:${OVER_TIME[key]}次`)
                return service.request({
                    data,
                    headers,
                    method,
                    url
                })
            }
        }
        return Promise.reject(err)
    }
)

export default service