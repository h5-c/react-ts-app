import { useState, useEffect, useRef } from 'react'

// 设置cookie、默认有效时间7天(可设置小数)
export const setCookie = (name: string, value: any, day: number = 7) => {
    day = day * 1000 * 60 * 60 * 24
    const date = new Date()
    date.setTime(date.getTime() + day)
    // 引用类型转换为字符类型
    if (value instanceof Object || value instanceof Array) value = JSON.stringify(value)
    console.log(date)
    document.cookie = `${name}=${value};expires=${date}`
}

// 获取指定cookie
export const getCookie = (name: string) => {
    let cookie = document.cookie.split('; ')
    for (let key of cookie) {
        let _key = key.split('=')
        if (_key[0] === name && _key[1]) return _key[1]
    }
}

// 清除cookie
export const delCookie = (name: string) => {
    document.cookie = `${name}=;expires=${new Date(0)}`
}


// 深拷贝
export const deepCopy = (val: any) => JSON.parse(JSON.stringify(val))

// 获取redux && state
export const stateProps = (state: any) => {
    return { ...state }
}

// 派发dispatch
export const dispatchProps = (dispatch: Function) => {
    return {
        getDispatch(type: string, value: any) {
            dispatch({ type, value })
        }
    }
}

// useCallbackState封装返回修改后的值
export const useCallbackState = (value: any) => {
    const cbRef = useRef()
    const current: any = cbRef.current
    const [data, setData] = useState(value)
    useEffect(() => {
        current && current(data)
    }, [current, data])
    return [data, (d: any, callback: any) => {
        cbRef.current = callback
        setData(d)
    }]
}

// 防抖
let consfig = true
export const antiShake = (fun: Function, time: number = 1000) => {
    if (consfig) {
        consfig = false
        fun()
        setTimeout(() => {
            consfig = true
        }, time)
    }
}