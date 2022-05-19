import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getPartner, getMenuByAppId } from '@/api/request-url'
import { stateProps, dispatchProps, getCookie, deepCopy } from '@/utils/common'
import { Spin } from 'antd'

function Index(state: { loading?: boolean, getDispatch?: Function }) {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const getDispatch = (name: string, val: any) => {
        state.getDispatch && state.getDispatch(name, val)
    }
    const getUserData = () => {
        getPartner().then((res: any) => {
            const { msg, payload} = res
            if (msg === 'ok' && payload) {
                const userInfo: string | undefined = getCookie('userInfo')
                const _userInfo = userInfo && JSON.parse(userInfo)
                const { tenantId, userId, username } = _userInfo
                getDispatch('defaultParams', { userId, tenantId, appId: 623 })
                getDispatch('user', { id: userId, name: username })
                // 获取菜单
                let params = {
                    appCode: 'dd',
                    menuGroupCode: 'operate',
                    username: tenantId
                }
                getMenuByAppId(params).then((res: any) => {
                    const { msg, payload} = res
                    if (msg === 'ok' && payload) {
                        let menuList = [],
                            elementPages: any[] = []
                        const menuHandle = (arr: any[]) => {
                            return arr.map(item => {
                                if (item.type === 0) item.children = menuHandle(item.children.map((_item: { code: string }) =>  (_item.code = `${item.code}/${_item.code}`) && _item))
                                else if (item.type === 1) elementPages.push(item)
                                item.code = `/${item.code}`
                                return item
                            })
                        }
                        menuList = menuHandle(deepCopy(payload))
                        getDispatch('menuList', menuList)
                        getDispatch('loading', false)
                        getRoutes(elementPages)
                    }
                })
            }
        })
    }
    const getRoutes = (arr: any []) => {
        const routes = []
        const lastCode = deepCopy(arr).pop().code
        for (const key of arr) {
            routes.push({ path: key.code, name: key.name })
            if (key.code === lastCode) {
                getDispatch('allRoutes', routes)
                pathname === '/' && navigate('/home')
            }
        }
    }
    useEffect(() => {
        const token = getCookie('token')
        // 判断登录状态
        if (token) getUserData()
        else navigate('/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Spin spinning={state.loading} size="large" tip="正在加载中、请稍后...">
            <div style={{ height: '100%' }}></div>
        </Spin>
    )
}

export default connect(stateProps, dispatchProps)(Index)