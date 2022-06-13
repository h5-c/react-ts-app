import { useEffect, useState, useRef } from 'react'

type Callbeck<T> = (prev?: T) => void

interface Config{
    immdiate: Boolean
}

export const useWatch = <T>(data: T, callback: Callbeck<T>, config: Config = { immdiate: false }) => {
    const prev = useRef<T>()
    const { immdiate } = config
    const inited = useRef(false)
    const stop = useRef(false)
    useEffect(() => {
        const execute = () => callback(prev.current)
        if (!stop.current) {
            if (!inited.current) {
                inited.current = true
                immdiate && execute()
            } else {
                execute()
            }
            prev.current = data
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    return () => stop.current = true
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
