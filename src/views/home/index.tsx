// import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { stateProps, dispatchProps } from '@/utils/common'
import { Button } from 'antd'

function Index(state: { getDispatch?: Function }) {
    const getDispatch = () => {
        if (state.getDispatch)
        state.getDispatch('asdfghjkl', 10086)
    }
    return (
        <div>
            home
            <Link to="/homes">不存在的页面</Link>
            <Button onClick={getDispatch}>dispatch</Button>
        </div>
    )
}

export default connect(stateProps, dispatchProps)(Index)