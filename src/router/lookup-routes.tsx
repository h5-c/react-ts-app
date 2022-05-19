import { connect } from 'react-redux'
import { stateProps } from '@/utils/common'
import DynamicRoutes from '@/router/dynamic-routes'
import Error from '@/views/error'

function Index(state: { loading?: boolean }) {
    return state.loading ?
        <DynamicRoutes/> :
        <Error id='404'/>
}

export default connect(stateProps)(Index)