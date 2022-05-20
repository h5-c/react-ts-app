import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import modules from './error.module.scss'

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
        return <div className={modules.content}>
            <object className={modules.icon} data={icon} aria-label={`${error_id}`} />
            <p className={modules.message}>{message[error_id]}</p>
        </div>
    }
    return (
        <div className={`${modules.box}`}>
            <ErrorContent/>
            <div className={modules.btn_group}>
                <Button className={modules.ant_btn} type="primary" shape="round" onClick={() => navigate('/home')}>返回首页</Button>
                <Button className={modules.ant_btn} shape="round" style={{ borderColor: '#1890ff', color: '#1890ff' }} onClick={() => navigate(-1)}>返回上一页</Button>
            </div>
        </div>
    )
}
