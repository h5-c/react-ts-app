import { useState, useEffect, lazy } from 'react'
import { HashRouter, useRoutes } from 'react-router-dom'
import { connect } from 'react-redux'
import { stateProps, getCookie } from '@/utils/common'
import Suspense from '@/components/suspense'
import basicsRoutes from '@/router/basics-routes'
import dynamicRoutes from '@/router/dynamic-routes'
import '@/assets/style/common.scss'
const Layouts = lazy(() => import('@/components/layouts'))

interface state{
    DynamicRoutes: {
        path: string
        element: JSX.Element
    }[]
}

function Index(state: { allRoutes?: { code: string }[] }) {
    const [data, setData] = useState<state>({ DynamicRoutes: [] })
    const Routes = () => {
        return useRoutes([...basicsRoutes, ...data.DynamicRoutes ])
    }
    useEffect(() => {
        if (state.allRoutes) {
            const DynamicRoutes = state.allRoutes.map(key => {
                return { path: key.code, element: <Suspense><Layouts contentPath={key.code} /></Suspense> }
            })
            if (JSON.stringify(DynamicRoutes) !== JSON.stringify(data.DynamicRoutes)) setData({ DynamicRoutes })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.allRoutes])
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        if (token) dynamicRoutes(token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <HashRouter>
            <Routes />
        </HashRouter>
    )
}

export default connect(stateProps)(Index)
