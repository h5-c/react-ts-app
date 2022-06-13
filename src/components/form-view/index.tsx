import { Form, Cascader, Checkbox, Input } from 'antd'
import modules from './form.module.scss'

interface props{
    class?: string;
    labelCol?: number;
    fields?: any[];
    items: items[];
    onFinish?: any;
    onFinishFailed?: any;
    onValuesChange?: any;
    children?: JSX.Element
}

interface items{
    type?: string
    types?: string
    name?: string
    label?: string
    placeholder?: string
    tooltip?: JSX.Element
    min?: number
    max?: number
    options?: any[]
    multiple?: boolean
    children?: JSX.Element
    getValueFromEvent?: any
    valuePropName?: string
    rules?: any[]
    addonAfter?: JSX.Element
    noStyle?: boolean
}

export default function Index(props: props) {
    const labelCol = props.labelCol ? props.labelCol : 3 // label默认宽度
    const { items } = props
    const getViewType = (item: items) => {
        const { type, types, label, placeholder, min, max, options, multiple, children, addonAfter } = item
        if (type === 'cascader') {
            return <Cascader placeholder={placeholder ? placeholder : `请选择${label}`} options={options} multiple={multiple}/>
        } else if (type === 'checkbox') {
            return <Checkbox>{children}</Checkbox>
        } else if (type === 'children') {
            return children
        } else if (type === 'text') {
            return children
        } else {
            if (types === 'password') {
                return <Input.Password placeholder={placeholder ? placeholder : `请输入${min ? min + '~' : ''}${max ? max + '位' : ''}${label}`} maxLength={max} />
            } else if (types === 'textArea') {
                return <Input.TextArea placeholder={placeholder ? placeholder : `请输入${min ? min + '~' : ''}${max ? max + '位' : ''}${label}`} maxLength={max}/>
            } else {
                return <Input placeholder={placeholder ? placeholder : `请输入${min ? min + '~' : ''}${max ? max + '位' : ''}${label}`} maxLength={max} addonAfter={addonAfter} />
            }
        }
    }
    return (
        <Form className={props.class} labelCol={{ span: labelCol }} fields={props.fields} onFinish={props.onFinish} onFinishFailed={props.onFinishFailed} onValuesChange={props.onValuesChange}>
            {
                items.map((item, index) => {
                    return (
                        <Form.Item
                            className={item.type !== 'text' ? modules.item : modules.item_text}
                            wrapperCol={ !item.label ? { offset: labelCol } : undefined }
                            name={item.name}
                            label={item.label}
                            getValueFromEvent={item.getValueFromEvent}
                            tooltip={item.tooltip}
                            valuePropName={item.valuePropName}
                            hasFeedback
                            rules={item.rules}
                            noStyle={item.noStyle}
                            key={index}>
                            { getViewType(item) }
                        </Form.Item>
                    )
                })
            }
            { props.children }
        </Form>
    )
}