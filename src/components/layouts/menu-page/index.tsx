import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Button } from 'antd'
import ScrollView from 'react-custom-scrollbars'
import { MenuUnfoldOutlined, HomeOutlined, FileProtectOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { stateProps, dispatchProps } from '@/utils/common'

function Index(state: { class: string, menuList?: any[] }) {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({ menuList: [], openKeys: [], selectedKeys: [], collapsed: false })
    // 修改数据
    const setDatas = (name: string, val: any) => {
        return new Promise(resolve => {
            const obj: any = {}
                obj[name] = val
            setData(res => ({ ...res, ...obj }))
            resolve(obj)
        })
    }
    // 展开菜单
    const setMenuCollapsed = () => {
        setDatas('collapsed', !data.collapsed)
    }
    // 记录菜单打开项
    const onOpenChange = (openKeys: any[]) => {
        setDatas('openKeys', openKeys)
    }
    // 路由跳转
    const onMenuClick = (dom: { key: string }) => {
        if (dom.key === pathname) return
        setDatas('selectedKeys', dom.key)
        navigate(dom.key)
    }
    useEffect(() => {
        // 条件渲染菜单
        const iconPages: any = {
            '/home': <HomeOutlined/>,
            '/commodity': <FileProtectOutlined/>,
            '/customer': <UsergroupAddOutlined />
        }
        const getMenuList: Function = (arr: any[]) => {
            return arr && arr.map((item: { name: string, code: string, children: any }) => {
                const { name, code, children } = item
                return { label: name, key: code, icon: iconPages[code], children: getMenuList(children) }
            })
        }
        setData(res => ({ ...res, menuList: getMenuList(state.menuList) }))
    }, [state.menuList])
    useEffect(() => {
        // 计算当前路由下的submen集合
        const  openKeys: any[] = [],
            page = pathname.split('/').filter(item => item),
            pages = page.slice(0, page.length - 1)
        for (let y = 0; y < pages.length; y ++) {
            openKeys.push(`/${pages.slice(0, y+1).join('/')}`)
        }
        setData((res: any) => ({ ...res, openKeys, selectedKeys: pathname }))
    }, [pathname])
    return (
        <div className={state.class}>
            <ScrollView style={{ width: data.collapsed ? 80 : 180, height: 'calc(100vh - 92px)', transition: 'width 300ms' }}>
                <Menu mode="inline"
                    openKeys={data.openKeys}
                    selectedKeys={data.selectedKeys}
                    inlineCollapsed={data.collapsed}
                    items={data.menuList}
                    onClick={onMenuClick}
                    onOpenChange={onOpenChange}>
                </Menu>
            </ScrollView>
            <Button title={data.collapsed ? '展开菜单' : '收起菜单'} onClick={setMenuCollapsed}>
                <MenuUnfoldOutlined style={{ transform: `rotateZ(${data.collapsed ? -180: 0}deg)`, transition: 'transform 300ms' }} />
            </Button>
        </div>
    )
}

export default connect(stateProps, dispatchProps)(Index)
