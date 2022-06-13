import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Spin, Modal, message, Form } from 'antd'
import { sysRegion } from '@/api/request-url'
import FormView from '@/components/form-view'
import jsencrypt from 'jsencrypt'
// import ScrollView from 'react-custom-scrollbars'
import modules from './register.module.scss'

interface region{
    value: number,
    label: string,
    children?: region[]
}
interface form{
    name: string
    password: string
    confirmPassword: string
    region: number[]
    detailedRegion: string
    phoneCode: string
    confirmCode: string
    remember: string
}
interface state{
    region: region[]
    confirmCode: {
        loading: boolean
        disabled: boolean
        num: number | null
    }
    form: form
    modal: {
        title: string | null
        visible: boolean
        children: any
    }
}

export default function Index(props: { setRoutes: Function }) {
    const [data, setData] = useState<state>({
        region: [],
        confirmCode: {
            loading: false,
            disabled: false,
            num: null
        },
        form: {
            name: '',
            password: '',
            confirmPassword: '',
            region: [],
            detailedRegion: '',
            phoneCode: '',
            confirmCode: '',
            remember: ''
        },
        modal: {
            title: null,
            visible: false,
            children: null
        }
    })
    const navigate = useNavigate()
    // 获取短信验证码
    const getConfirmCode = () => {
        const regExp = /^1[3|4|5|6|7|8]\d{9}$/
        if (data.form.phoneCode && regExp.test(data.form.phoneCode)) {
            console.log(data.form)
            setData({ ...data, confirmCode: { ...data.confirmCode, loading: true } })
            setTimeout(() => {
                message.success(`短信已下发到您的手机(${data.form.phoneCode})、请注意查收`)
                setData({ ...data, confirmCode: { loading: false, disabled: true, num: 60 } })
                let num = 60
                const setConfirmCodeNum = () => {
                    setTimeout(() => {
                        if (num) {
                            num -= 1
                            setData({ ...data, confirmCode: { ...data.confirmCode, disabled: true, num } })
                            setConfirmCodeNum()
                        } else {
                            setData({ ...data, confirmCode: { ...data.confirmCode, disabled: false } })
                        }
                    }, 1000)
                }
                setConfirmCodeNum()
            }, 1000)
        } else {
            message.warning('请检查手机号输入是否正确')
        }
    }
    // 注册表单
    const formList = [{
        type: 'input',
        name: 'name',
        label: '用户名',
        min: 5,
        max: 16,
        rules: [{ required: true, min: 5, message: '请输入5位或以上用户名！'}]
    }, {
        type: 'input',
        types: 'password',
        name: 'password',
        label: '密码',
        min: 8,
        max: 24,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9a-zA-Z]/g,''),
        rules: [{ required: true, min: 8, message: '请输入8位以上由大、小写，数字组成的密码！'}]
    }, {
        type: 'input',
        types: 'password',
        name: 'confirmPassword',
        label: '确认密码',
        min: 8,
        max: 24,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9a-zA-Z]/g,''),
        rules: [(form: { getFieldValue: Function }) => ({ required: true, validator(_: any, value: string) {
            if (value && value.length >= 8) {
                if (form.getFieldValue('password') === value) return Promise.resolve()
                return Promise.reject(new Error('输入不一致、请检查确认密码！'))
            }
            return Promise.reject(new Error('请输入8位以上由大、小写，数字组成的密码！'))
        }})]
    }, {
        type: 'cascader',
        name: 'region',
        label: '地区',
        options: data.region,
        rules: [{ required: true, message: '请选择所在地区！'}]
    }, {
        name: 'detailedRegion',
        label: '详细地址',
        max: 24,
        placeholder: '请输入详细地址！',
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9a-z\u4e00-\u9fa5]/g,''),
        rules: [{ required: true, message: '请输入详细地址！'}]
    }, {
        name: 'phoneCode',
        label: '手机号',
        max: 11,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9]/g,''),
        rules: [{ required: true, validator: (_: any, value: string) => {
            const regExp = /^1[3|4|5|6|7|8]\d{9}$/
            if (value && value.length === 11 && regExp.test(value)) return Promise.resolve()
            return Promise.reject('请输入11位手机号！')
        }}]
    }, {
        name: 'confirmCode',
        label: '验证码',
        max: 4,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9]/g,''),
        rules: [{ required: true, min: 4, message: '请输入4位验证码！'}],
        addonAfter: <Spin spinning={false}>
            <Button type='text' loading={data.confirmCode.loading} disabled={data.confirmCode.disabled} onClick={getConfirmCode}>获取短信验证码{data.confirmCode.num ? `(${data.confirmCode.num})` : ''}</Button>
        </Spin>
    }, {
        type: 'checkbox',
        name: 'remember',
        valuePropName: 'checked',
        children: (<span style={{ fontSize: '12px' }}><span className='text-btn' onClick={() => getModal('用户服务协议')}>《用户服务协议》</span>和<span className='text-btn' onClick={() => getModal('隐私协议')}>《隐私协议》</span>勾选代表已阅读且同意。</span>)
    }, {
        type: 'text',
        children: (<>
            <Button type='link' shape='circle' onClick={() => navigate('/login')}>已有账号、前往登录？</Button>
            {/* <Button type='text' disabled={data.isDisabled} shape='circle' style={{ color: '#999' }}>忘记密码、立即前往修改？</Button> */}
        </>)
    }, {
        type: 'children',
        children: (<>
            <Button type="primary" htmlType="submit">注册</Button>
        </>)
    }]
    // 打开用户协议弹窗
    const getModal = (title: string) => {
        let modal = { title, visible: true, children: <h3>{ title }</h3> }
        setData({ ...data, modal })
    }
    // 关闭用户协议弹窗
    const onModalCancel = () => {
        let modal = { title: null, visible: false, children: null }
        setData({ ...data, modal })
    }
    // 获取地区编码
    const getSysRegion = () => {
        sysRegion().then((res: any) => {
            if (res.msg === 'ok') {
                setData({ ...data, region: res.payload })
            }
        })
    }
    // 提交表单
    const onFinish = (value: form) => {
        if (value.remember) {
            let jsen = new jsencrypt()
            jsen.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgNefYXp+cwYyqIvQJNPE8EqJad+wswuNA7qQouAh23LbYprfduv/ERjJd2F1L74WysKqjHhGXVHY3rnbggZMtnXaO4Tp7mOlyJEA+FhybmaWujUpQXcUPhDhLNs8ZLPCSjz4PdIxIu9COroQnbXWpN1A9VJef8clmnYiIfw0PwQIDAQAB-----END PUBLIC KEY-----')
            const password = jsen.encrypt(value.password)
            console.log({ ...value, password})
        } else {
            message.error('请阅读并勾选《用户服务协议》和《隐私协议》!')
        }
    }
    // 绑定form表单数据
    const onValuesChange = (_: string, form: form) => setData({ ...data, form })
    useEffect(() => {
        getSysRegion()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={modules.box}>
            <FormView items={formList} onFinish={onFinish} onValuesChange={onValuesChange} />
            <Modal width='800px' title={data.modal.title} visible={data.modal.visible} onCancel={onModalCancel} footer={null}>{data.modal.children}</Modal>
        </div>
    )
}
