import { getPartner, getMenuByAppId } from '@/api/request-url'
import { getCookie, deepCopy } from '@/utils/common'
import store from '@/store'

const getDispatch = (type: string, value: string | boolean | object | any[]) => {
    store.dispatch({ type, value })
}

const dynamicRoutes = (token: string) => {
    return new Promise(resolves => {
        getPartner().then((res: any) => {
            const { msg, payload} = res
            if (msg === 'ok' && payload) {
                const userInfo: string | undefined = getCookie('userInfo')
                const _userInfo = userInfo && JSON.parse(userInfo)
                const { tenantId, userId, username } = _userInfo
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
                        allRoutes: any[] = []
                        const menuHandle = (arr: any[]) => {
                            return arr.map(item => {
                                if (item.type === 0) item.children = menuHandle(item.children.map((_item: { code: string }) =>  (_item.code = `${item.code}/${_item.code}`) && _item))
                                else if (item.type === 1) allRoutes.push(item)
                                item.code = `/${item.code}`
                                return item
                            })
                        }
                        menuList = menuHandle(deepCopy(payload))
                        getDispatch('defaultParams', { userId, tenantId, appId: 623 })
                        getDispatch('user', { id: userId, name: username })
                        getDispatch('menuList', menuList)
                        getDispatch('allRoutes', allRoutes)
                        getDispatch('token', token)
                        resolves(allRoutes)
                    }
                })
            }
        })
    })
}

export default dynamicRoutes