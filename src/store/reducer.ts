import { deepCopy } from '../utils/common'

// 默认数据
const defaultState = {
    menuList: [],
    allRoutes: [],
    user: { id: null, name: null },
    token: null
}

const reducer = (state: any = defaultState, action: { type: string, value: boolean | string | number | object | any[] }) => {
    const stateCopy = deepCopy(state),
        { type, value } = action
    if (type && value !== undefined) {
        stateCopy[type] = value
    }
    return stateCopy
}
export default reducer