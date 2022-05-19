import service from './index'
import store from '@/store'

const request = (method: string, url: string, params?: object, data?: object) => {
    let defaultParams = store.getState().defaultParams
    if (method === 'GET') params = { ...params, ...defaultParams }
    return service.request({ method, url, params, data })
}

export const get = (url: string, params?: object) => request('GET', url, params, {})

export const post = (url: string, params: object) => request('POST', url, {}, params)

export const put = (url: string, params: object) => request('PUT', url, params)

export const del = (url: string, params: object) => request('DELETE', url, params)
