import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { stateProps, dispatchProps } from '@/utils/common'
import { Dropdown, Menu, Modal  } from 'antd'
import { UserDeleteOutlined, DownOutlined } from '@ant-design/icons'
import { delCookie } from '@/utils/common'

function Index(state: { class: string; user?: { name?: string }; getDispatch?: Function }) {
    const [data, setData] = useState({ userName: null })
    const getLogin = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定退出当前系统？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                delCookie('token')
                // 清空用户路由权限
                state.getDispatch && state.getDispatch('allRoutes', [])
            }
        })
    }
    const menuList: any[] = [{
        label: <Link to={'/'}>修改密码</Link>
    }, {
        label: <Link to={'/'}>账户管理</Link>
    }, {
        label: <span onClick={getLogin}>退出登录</span>
    }]
    useEffect(() => {
        setData((res: any) => ({ ...res, userName: state.user && state.user.name }))
    }, [state.user])
    return (
        <header className={`${state.class}`}>
            <div className='logo'>
                ADMIN-LOGO
            </div>
            <div className='user-page'>
                <UserDeleteOutlined />
                <Dropdown className='user-name' overlay={<Menu items={menuList}/>} placement="bottom" arrow>
                    <span>{data.userName} <DownOutlined /></span>
                </Dropdown>
            </div>
        </header>
    )
}

export default connect(stateProps, dispatchProps)(Index)