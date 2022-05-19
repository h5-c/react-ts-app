import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import scssModules from './error.module.scss'

export default function Index(props: {id?: string}) {
    const { id } = useParams()
    const navigate = useNavigate()
    const ErrorContent = () => {
        const error_id = id ? id : props.id ? props.id : '404'
        const icon = require(`@/assets/images/error/${error_id}.svg`)
        const message: any = {
            '403': '您访问的内容、目前暂未开放！',
            '404': '未找到您访问的内容(不存在、或已移除)！',
            '500': '服务器内部错误！'
        }
        return <div className={scssModules.content}>
            <object className={scssModules.icon} data={icon} aria-label={`${error_id}`} />
            <p className={scssModules.message}>{message[error_id]}</p>
        </div>
    }
    useEffect(() => {
        console.log(id)
    }, [])
    return (
        <div className={`${scssModules.box}`}>
            <ErrorContent/>
            <div className={scssModules.btn_group}>
                <Button className={scssModules.ant_btn} type="primary" shape="round" onClick={() => navigate('/home')}>返回首页</Button>
                <Button className={scssModules.ant_btn} shape="round" style={{ borderColor: '#1890ff', color: '#1890ff' }} onClick={() => navigate(-1)}>返回上一页</Button>
            </div>
        </div>
    )
}
