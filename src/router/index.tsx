import { useState, useEffect, lazy } from 'react'
import { HashRouter, useRoutes, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { getCookie } from '@/utils/common'
import Suspense from '@/components/suspense'
import dynamicRoutes from '@/router/dynamic-routes'
import '@/assets/style/common.scss'
const Layouts = lazy(() => import('@/components/layouts'))
const Login = lazy(() => import('@/views/login'))
const Register = lazy(() => import('@/views/register'))
const Error = lazy(() => import('@/views/error'))

interface state {
    DynamicRoutes: {
        path: string
        element: JSX.Element
    }[]
}

// 基础页面跳转首页
function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        navigate(token ? '/home' : '/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <></>
}

export default function Index() {
    const [data, setData] = useState<state>({ DynamicRoutes: [] })
    // 设置动态路由
    const setRoutes = (arr: { code: string }[]) => {
        const DynamicRoutes = arr.map((key: { code: string }) => ({ path: key.code, element: <Suspense><Layouts setRoutes={setRoutes} contentPath={key.code} /></Suspense> }))
        setData({ DynamicRoutes })
    }
    // 基础路由
    const basicsRoutes = [{
        path: '/',
        element: <Home/>
    }, {
        path: '/login',
        element: <Suspense><Login setRoutes={setRoutes}/></Suspense>
    }, {
        path: '/register',
        element: <Suspense><Register setRoutes={setRoutes}/></Suspense>
    }, {
        path: '/error/:id',
        element: <Suspense><Error/></Suspense>
    }, {
        path: '/*',
        element: <Suspense><Error/></Suspense>
    }]
    const Routes = () => useRoutes([...basicsRoutes, ...data.DynamicRoutes ])
    const getUserAgent = () => {
        const userAgent= navigator.userAgent.toLowerCase();
        const bIsIpad = userAgent.match(/ipad/i)
        const bIsIphoneOs = userAgent.match(/iphone os/i)
        const bIsMidp = userAgent.match(/midp/i)
        const bIsUc7 = userAgent.match(/rv:1.2.3.4/i)
        const bIsUc = userAgent.match(/ucweb/i)
        const bIsAndroid= userAgent.match(/android/i)
        const bIsCE = userAgent.match(/windows ce/i)
        const bIsWM = userAgent.match(/windows mobile/i)
        const mobilds = bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM
        if (mobilds) {
            message.warning(`您正在使用${mobilds[0]}浏览、请注意分辨率缩放`)
        }
    }
    useEffect(() => {
        const token = getCookie('token')
        // 判断设备类型
        getUserAgent()
        // 判断登录状态
        if (token) dynamicRoutes(token).then((routes: any) => {
            setRoutes(routes)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <HashRouter>
            <Routes />
        </HashRouter>
    )
}

