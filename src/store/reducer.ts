import { deepCopy } from '../utils/common'

// 默认数据
const defaultState = {
    loading: true,
    menuList: [],
    allRoutes: [],
    user: { id: null, name: null },
    quickNav: []
}

const reducer = (state: any = defaultState, action: { type: string, value: boolean | string | number | object | any[] }) => {
    const stateCopy = deepCopy(state),
        { type, value } = action
    if (value === 'getDelete') {
        delete stateCopy[type]
    } else if (type) {
        stateCopy[type] = value
    }
    return stateCopy
}
export default reducer