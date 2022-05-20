import { useEffect, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import Suspense from '@/components/suspense'
import { getCookie } from '@/utils/common'
const Login = lazy(() => import('@/views/login'))
const Register = lazy(() => import('@/views/register'))
const Error = lazy(() => import('@/views/error'))

const Home = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        if (token) navigate('/home')
        else navigate('/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <></>
}

const Suspenses =(props: {children: any}) => {
    return <Suspense children={props.children}/>
}

const basicsRoutes: {
    path: string;
    name: string;
    element: JSX.Element;
}[] = [{
    path: '/',
    name: '基础',
    element: <Home/>
}, {
    path: '/login',
    name: '登录',
    element: <Suspenses><Login/></Suspenses>
}, {
    path: '/register',
    name: '注册',
    element: <Suspenses><Register/></Suspenses>
}, {
    path: '/error/:id',
    name: '错误',
    element: <Suspenses><Error/></Suspenses>
}, {
    path: '/*',
    name: '404',
    element: <Suspenses><Error/></Suspenses>
}]

export default basicsRoutes
