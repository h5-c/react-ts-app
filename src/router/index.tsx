import { useEffect } from 'react'
import { connect } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { stateProps, useCallbackState } from '@/utils/common'
import basicsRoutes from '@/router/basics-routes'
import Layouts from '@/components/layouts'
import '@/assets/style/common.scss'

function Index(state: { loading?: boolean, getDispatch?: Function, allRoutes?: any[] }) {
    const [data, setData] = useCallbackState({ getDynamicRoutes: [] })
    useEffect(() => {
        state.allRoutes && setData({ getDynamicRoutes: state.allRoutes })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.allRoutes])
    return (
        <HashRouter>
            <Routes>
                {/* 基础路由 */}
                { basicsRoutes.map((item, index: number) => <Route {...item} key={index} />) }
                {/* 动态路由 */}
                { 
                    data.getDynamicRoutes.map((item: { path: string; element: JSX.Element }, index: number) => {
                        return <Route path={item.path} element={<Layouts contentPath={item.path} />} key={index} />
                    })
                }
            </Routes>
        </HashRouter>
    )
}

export default connect(stateProps)(Index)