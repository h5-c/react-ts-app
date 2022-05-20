import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { stateProps, dispatchProps, useCallbackState } from '@/utils/common'
import { Tooltip } from 'antd'
import { CloseOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import scssModule from './switch.module.scss'

interface state{
    move: boolean
    items: {
        value: string
        label: string
        style: object
    }[]
    contenLeft: number
}

function Index(state: {
    allRoutes?: {
        code: string
        name: string
    }[]
    convenientNav?: {
        value: string
        label: string
        style: object
    }[]
    getDispatch?: Function 
}) {
    const boxRef: any = useRef(),
    contentRef: any = useRef(),
    activeRef: any = useRef(),
    { pathname } = useLocation(),
    navigate = useNavigate(),
    [data, setData] = useCallbackState({ move: false, items: [], contenLeft: 0 }),
    // 关闭按钮
    getClose = (value: string) => {
        const items = data.items.map((item: { value: string, style: object }) => {
            if (item.value === value) item.style = { opacity: 0, minWidth: 0, width: 0, padding: 0, border: 0, transition: 'all 500ms' }
            return item
        }) // 加入动画、DOM缓慢消失
        setData((res: state) => ({ ...res, items }), () => {
            setTimeout(() => { // 动画结束后删除DOM
                const items = data.items.filter((item: { value: string }) => (item.value !== value)).map((item: { style: object }) => (item.style = { transition: 'none' }) && item )
                setData((res: state) => ({ ...res, items}), () => {
                    // DOM渲染机制、active节点在后一位，删除当前节点，active会获得短暂动画，故暂停动画、防止DOM动画抖动
                    setTimeout(() => {
                        setData((res: state) => ({ ...res, items: res.items.map(key => (key.style = {}) && key) }), (res: state) => {
                            state.getDispatch && state.getDispatch('convenientNav', res.items)
                            getActiveLeft()
                        })
                    }, 100)
                })
            }, 500)
        })
    },
    // 左右切换
    getMove = (n: number) => {
        let contenLeft = data.contenLeft + (100 * n)
        const boxWidth = boxRef.current.offsetWidth
        const contentWidth = contentRef.current.offsetWidth
        if (n === 1 ) {
            if (contenLeft >= 0) contenLeft = 0
            else if (contenLeft%100 !== 0) contenLeft =  contenLeft - contenLeft%100 - 100
        } else if (n === -1 && contenLeft <= -(contentWidth - boxWidth)){
            contenLeft = -(contentWidth - boxWidth)
        }
        setData(({ ...data, contenLeft }))
    },
    // 计算active位置
    getActiveLeft = () => {
        const boxWidth = boxRef.current.offsetWidth
        const contentWidth = contentRef.current.offsetWidth
        const activeLeft = activeRef.current.offsetLeft
        let contenLeft = data.contenLeft
        let move = false
        if (boxWidth < contentWidth) move = true
        if (boxWidth <= activeLeft + 100) contenLeft = -(activeLeft + 100 - boxWidth)
        else contenLeft = 0
        setData((res: state) => ({ ...res, move, contenLeft }), () => {
            setTimeout(() => {
                const boxWidths = boxRef.current.offsetWidth
                boxWidth !== boxWidths && getActiveLeft()
            }, 100)
        })
    },
    // 字数超过限制时省略采用提示查看
    getTooltip = (item: { label: string, value: string, style: object }) => {
        const { label, style } = item
        const btn = <span className={scssModule.item_btn} style={style} onClick={() => item.value !== pathname && navigate(item.value)}>{label}</span>
        if (label.length > 5) return <Tooltip color={'white'} title={label} overlayInnerStyle={{ color: '#666' }}>{btn}</Tooltip>
        else return btn
    },
    getConvenientNav = (val: state) => {
        // 新增
        if (!val.items.filter((key: { value: string }) => key.value === pathname).length) {
            const allRoutes = state.allRoutes ? state.allRoutes : []
            for (const key of allRoutes) {
                if (key.code === pathname) {
                    const items = { label: key.name, value: key.code, style: { opacity: 0 } }
                    setData({ ...val, items: [...val.items, items] }, () => {
                        setData((res: state) => ({ ...res, items: res.items.map(key => (key.style = {}) && key) }), (res: state) => {
                            state.getDispatch && state.getDispatch('convenientNav', res.items)
                            getActiveLeft()
                        })
                    })
                }
            }
        } else {
            getActiveLeft()
        }
    }
    useEffect(() => {
        // 调用redux数据
        if (!data.items.length && state.convenientNav) setData((res: state) => ({ ...res, items: state.convenientNav }), () =>  getActiveLeft())
        else getConvenientNav(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])
    return (
        <div className={scssModule.tag} style={{ padding: data.move ? '0 20px' : 0 }}>
            <div className={scssModule.tag_box} ref={boxRef}>
                <div className={scssModule.tag_content} ref={contentRef} style={{ left: `${data.contenLeft}px` }}>
                    {
                        data.items.map((item: { label: string, value: string, style: object }, index: number) => {
                            return (
                                <div ref={item.value === pathname ? activeRef : null}
                                    className={`${item.value === pathname ? scssModule.active : ''} ${scssModule.tag_item}`}
                                    style={item.style}
                                    key={index}>
                                    { getTooltip(item) }
                                    <span style={item.style} className={scssModule.close_btn} onClick={() => getClose(item.value)}><CloseOutlined /></span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                data.move &&
                <>
                    <DoubleLeftOutlined className={scssModule.move_btn} onClick={() => getMove(1)} />
                    <DoubleRightOutlined className={`${scssModule.move_btn} ${scssModule.move_btn_right}`}  onClick={() => getMove(-1)} />
                </>
            }
        </div>
    )
}
export default connect(stateProps, dispatchProps)(Index)
