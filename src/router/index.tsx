import { useState, useEffect, lazy } from 'react'
import { connect } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { stateProps, dispatchProps, getCookie } from '@/utils/common'
import Suspense from '@/components/suspense'
import basicsRoutes from '@/router/basics-routes'
import dynamicRoutes from '@/router/dynamic-routes'
import '@/assets/style/common.scss'
const Layouts = lazy(() => import('@/components/layouts'))

interface state{
    dynamicRoutes: { code: string }[]
}

function Index(state: { allRoutes?: { code: string }[], getDispatch?: Function }) {
    const [data, setData] = useState<state>({ dynamicRoutes: [] })
    useEffect(() => {
        state.allRoutes && setData({ dynamicRoutes: state.allRoutes  })
    }, [state.allRoutes])
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        if (token) dynamicRoutes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <HashRouter>
            <Routes>
                {/* 基础路由 */}
                { basicsRoutes.map((item, index: number) => <Route {...item} key={index} />) }
                {/* 动态路由 */}
                { 
                    data.dynamicRoutes.map((item, index: number) => {
                        return <Route path={item.code} element={
                            <Suspense>
                            <Layouts contentPath={item.code} />
                        </Suspense>} key={index} />
                    })
                }
            </Routes>
        </HashRouter>
    )
}

export default connect(stateProps, dispatchProps)(Index)
