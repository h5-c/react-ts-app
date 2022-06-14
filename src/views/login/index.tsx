import { useEffect } from 'react'
import { useCallbackState } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { getImage, login } from '@/api/request-url'
import { Tabs, Spin, message, Button, Modal } from 'antd'
import { setCookie } from '@/utils/common'
import FormView from '@/components/form-view'
import jsencrypt from 'jsencrypt'
import QRCode from 'qrcode.react'
import dynamicRoutes from '@/router/dynamic-routes'
import loginBg from '@/assets/images/login_bg.mp4'
import modules from './login.module.scss'

export default function Index(props: { setRoutes: Function }) {
    const navigate = useNavigate()
    const [data, setData] = useCallbackState({ loading: false, picturepath: '', captchaKey: null, clause: false, isDisabled: false, userKey: null, modal: { title: null, visible: false, children: null } })
    const formList = [{
        name: 'name',
        label: '用户名',
        min: 5,
        max: 16,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,''),
        rules: [{ required: true, min: 5, message: '请输入5位或以上用户名！'}],
    },{
        types: 'password',
        name: 'password',
        label: '密码',
        min: 8,
        max: 24,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9a-zA-Z.!@#$]/g,''),
        rules: [{ required: true, min: 8, message: '请输入8位以上由大、小写，数字组成的密码！'}]
    }, {
        name: 'captcha',
        label: '验证码',
        max: 4,
        getValueFromEvent: (e: any) => e.target.value.replace(/[^0-9]/g,''),
        rules: [{ required: true, min: 4, message: '请输入4位验证码！'}],
        addonAfter: <Spin spinning={data.loading}><img onClick={() => getImages()} src={data.picturepath} alt="验证码" title="点击获取最新验证码" /></Spin>
    }, {
        type: 'checkbox',
        name: 'remember',
        valuePropName: 'checked',
        children: (<span style={{ fontSize: '12px' }}><span className='text-btn' onClick={() => getModal('用户服务协议')}>《用户服务协议》</span>和<span className='text-btn' onClick={() => getModal('隐私协议')}>《隐私协议》</span>勾选代表已阅读且同意。</span>)
    }, {
        type: 'text',
        children: (<>
            <Button type='link' disabled={data.isDisabled} shape='circle' onClick={() => navigate('/register')}>没有账号、前往注册？</Button>
            <Button type='text' disabled={data.isDisabled} shape='circle' style={{ color: '#999' }}>忘记密码、立即前往修改？</Button>
        </>)
    }, {
        type: 'children',
        children: (<>
            <Button type="primary" htmlType="submit" style={{ width: 'calc(100% - 69.75px)', borderRadius: '16px' }} loading={data.isDisabled}>登录</Button>
        </>)
    }]
    const formListB = [{
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
            <Button type='text'>获取短信验证码</Button>
        </Spin>
    }, {
        type: 'checkbox',
        name: 'remember',
        valuePropName: 'checked',
        children: (<span style={{ fontSize: '12px' }}><span className='text-btn' onClick={() => getModal('用户服务协议')}>《用户服务协议》</span>和<span className='text-btn' onClick={() => getModal('隐私协议')}>《隐私协议》</span>勾选代表已阅读且同意。</span>)
    }, {
        type: 'text',
        children: (<>
            <Button type='link' disabled={data.isDisabled} shape='circle' onClick={() => navigate('/register')}>没有账号、前往注册？</Button>
            <Button type='text' disabled={data.isDisabled} shape='circle' style={{ color: '#999' }}>忘记密码、立即前往修改？</Button>
        </>)
    }, {
        type: 'children',
        children: (<>
            <Button type="primary" htmlType="submit" style={{ width: 'calc(100% - 69.75px)', borderRadius: '16px' }} loading={data.isDisabled}>登录</Button>
        </>)
    }]
    const onFinish = (value: any) => {
        if (value.remember) {
            let jsen = new jsencrypt()
            jsen.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgNefYXp+cwYyqIvQJNPE8EqJad+wswuNA7qQouAh23LbYprfduv/ERjJd2F1L74WysKqjHhGXVHY3rnbggZMtnXaO4Tp7mOlyJEA+FhybmaWujUpQXcUPhDhLNs8ZLPCSjz4PdIxIu9COroQnbXWpN1A9VJef8clmnYiIfw0PwQIDAQAB-----END PUBLIC KEY-----')
            value.password = jsen.encrypt(value.password)
            setData({ ...data, isDisabled: true }, () => {
                let { name, password, captcha } = value,
                    captchaKey = data.captchaKey,
                    params = { name, password, captcha, captchaKey }
                login(params).then((res: any) => {
                    let payload = res.payload
                    if (res.msg === 'ok' && payload) {
                        setCookie('token', payload.token, 0.00023148148148148146)
                        dynamicRoutes(payload.token).then((routes: any) => {
                            props.setRoutes(routes)
                            navigate('/')
                        })
                    } else {
                        message.error(res.msg)
                        setData({ ...data, isDisabled: false })
                        getImages()
                    }
                }).catch(() => {
                    setData({ ...data, isDisabled: false })
                })
            })
        } else {
            message.error('请阅读并勾选《用户服务协议》和《隐私协议》!')
        }
    }
    // 获取验证码
    const getImages = () => {
        setData({ ...data, loading: true }, () => {
            getImage().then((res: any) => {
                if (res.msg === 'ok') {
                    setData({
                        ...data,
                        picturepath: res.payload.base64Img,
                        captchaKey: res.payload.captchaKey,
                        loading: false
                    })
                }
            }).catch(() => {
                setData({ ...data, loading: false })
            })
        })
    }
    const getModal = (title: string) => {
        let modal = { title, visible: true, children: <h3>{ title }</h3> }
        setData({ ...data, modal })
    }
    const onModalCancel = () => {
        let modal = { title: null, visible: false, children: null }
        setData({ ...data, modal })
    }
    const onChange = (key: string) => {
        if (key === 'qrCode') {
            setData({ ...data, userKey: `${Date.now()}` })
        }
    }
    useEffect(() => {
        getImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={modules.box}>
            <video className={modules.bg} autoPlay loop muted>
                <source src={loginBg} type="video/mp4"/>
            </video>
            <div className={modules.content}>
                <Tabs defaultActiveKey="1" centered onChange={onChange}>
                    <Tabs.TabPane tab="密码登录" key="1">
                        <FormView items={formList} onFinish={onFinish} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="短信验证" key="2">
                        <FormView items={formListB} onFinish={onFinish} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="扫码登录" key="qrCode">
                        <div className={`${modules.form} ${modules.qr_code}`}>
                            <QRCode value={`https://cms.zhangsir.cc/#/login?code=${data.userKey}`}/>
                            <span className={modules.qr_text}>请使用微信扫码二维码授权登录</span>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
                <Modal width='800px' title={data.modal.title} visible={data.modal.visible} onCancel={onModalCancel} footer={null}>{data.modal.children}</Modal>
            </div>
        </div>
    )
}
