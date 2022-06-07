import { useEffect, useRef } from 'react'

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


