import { Suspense } from 'react'
import { Spin } from 'antd'

export default function Index(props: { children?: JSX.Element }) {
    return (
        <Suspense fallback={<Spin size='large' tip='正在加载中、请稍候...' ><div style={{ height: '100%' }}></div></Spin>}>
            {props.children}
        </Suspense>
    )
}
