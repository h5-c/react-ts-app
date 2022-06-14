import { getPartner } from '@/api/request-url'
import { deepCopy } from '@/utils/common'
import store from '@/store'

const getDispatch = (type: string, value: string | boolean | object | any[]) => {
    store.dispatch({ type, value })
}

const dynamicRoutes = (token: string) => {
    return new Promise(resolves => {
        getPartner().then((res: any) => {
            const { msg, payload} = res
            if (msg === 'ok' && payload) {
                const { id, name, menu } = payload
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
                menuList = menuHandle(deepCopy(menu || []))
                getDispatch('user', { id, name })
                getDispatch('menuList', menuList)
                getDispatch('allRoutes', allRoutes)
                getDispatch('token', token)
                resolves(allRoutes)
            }
        })
    })
}

export default dynamicRoutes