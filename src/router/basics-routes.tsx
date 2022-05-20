import { lazy } from 'react'
import DynamicRoutes from '@/router/dynamic-routes'
import Login from '@/views/login'
import LookupRoutes from '@/router/lookup-routes'
const Register = lazy(() => import('@/views/register'))
const Error = lazy(() => import('@/views/error'))

const basicsRoutes: {
    path: string;
    name: string;
    element: JSX.Element;
}[] = [{
    path: '/',
    name: '验证登录',
    element: <DynamicRoutes/>
}, {
    path: '/login',
    name: '登录',
    element: <Login/>
}, {
    path: '/register',
    name: '注册',
    element: <Register/>
}, {
    path: '/error/:id',
    name: '错误',
    element: <Error/>
}, {
    path: '/*',
    name: '404',
    element: <LookupRoutes/>
}]

export default basicsRoutes
