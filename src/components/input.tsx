import { Input } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'

export default function input(props: any) {
    const onInput = (v: any) => {
        // 自定义校验规则(只能传入字符串转回函数)
        if (props.replace) {
            // eslint-disable-next-line no-eval
            v.target.value = eval(`false || (${props.replace})`)(v.target.value)
        }
        return v
    }
    return (
        props['set-type'] === 'password'?
        <Input.Password {...props} onInput={onInput} iconRender={visible => props['icon-render'] && (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/> :
        <Input {...props} onInput={onInput}/>
    )
}
