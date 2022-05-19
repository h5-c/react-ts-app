import DynamicRoutes from '@/router/dynamic-routes'
import Login from '@/views/login'
import Register from '@/views/register'
import Error from '@/views/error'
import LookupRoutes from '@/router/lookup-routes'

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
