import { useEffect, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '@/utils/common'
import Suspense from '@/components/suspense'
const Login = lazy(() => import('@/views/login'))
const Register = lazy(() => import('@/views/register'))
const Error = lazy(() => import('@/views/error'))

const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        navigate(token ? '/home' : '/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <></>
}

const basicsRoutes = [{
    path: '/',
    element: <Home/>
// }, {
//     path: '/login',
//     element: <Suspense><Login/></Suspense>
// }, {
//     path: '/register',
//     element: <Suspense><Register/></Suspense>
}, {
    path: '/error/:id',
    element: <Suspense><Error/></Suspense>
}, {
    path: '/*',
    element: <Suspense><Error/></Suspense>
}]

export default basicsRoutes
