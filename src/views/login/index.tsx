import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import jsencrypt from 'jsencrypt'
import { useNavigate } from 'react-router-dom'
import { getImage, login } from '@/api/request-url'
import { Spin, Form, Checkbox, message, Button, Modal } from 'antd'
import { UserDeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { deepCopy, stateProps, dispatchProps, setCookie } from '@/utils/common'
import Input from '@/components/input'
import scssModules from './login.module.scss'


const renderList = [{
    setType: 'name',
    name: 'username',
    label: '账号',
    maxLength: 11,
    replace: `val => val.replace(/[^0-9a-zA-Z]/g, '')`,
    placeholder: '请输入账号',
    suffix: <UserDeleteOutlined style={{ color: '#00000073' }} />,
    rules: [{ min: 4, message: '账号不得低于4位'}, { required: true, message: '请输入账号！'}]
}, {
    setType: 'password',
    name: 'password',
    label: '密码',
    maxLength: 24,
    replace: `val => val.replace(/[^0-9a-zA-Z.!]/g, '')`,
    placeholder: '请输入密码(可输入大写字母、小写字母、数字',
    iconRender: 'true',
    rules: [{ required: true, message: '请输入密码！'}, () => ({
        validator(_: any, value: string) {
            if (value && value.length < 6) {
                return Promise.reject(new Error('密码不得低于6位'))
            } else {
                return Promise.resolve()
            }
        }
    })]
}, {
    setType: 'number',
    name: 'captcha',
    label: '验证码',
    maxLength: 4,
    replace: `val => val.replace(/[^0-9]/g, '')`,
    placeholder: '请输入验证码',
    suffix: <CheckCircleOutlined style={{ color: '#00000073' }} />,
    rules: [{ required: true, min: 4, message: '请输入4位验证码！'}]
}]

function Index(state: any) {
    const formRef: any = useRef()
    const navigate = useNavigate()
    const [data, setData] = useState({ loading: false, picturepath: '', captchaKey: null, clause: false, isDisabled: false, modal: { title: null, visible: false, children: null } })
    const onFinish = (value: any) => {
        if (value.remember) {
            let jsen = new jsencrypt()
            jsen.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDNNorgFngK1zjHOnQlIUh5NjOxZIiEPZ8Knu6B/IyY0LBRToo1TZC7/nK6j8on/2sBdv5nFuTwlOpW9UL8C4yZJdjTwYXn5X+wZZsz1RXNI5zjhSXuGeYzF7WhxusKo6zrR6b0IMNg2W016PWU3UkjOXxoaIGkMN77oIorPP5bHQIDAQAB")
            value.password = jsen.encrypt(value.password)
            _setData({ isDisabled: true })
            let { username, password, captcha } = value,
                captchaKey = data.captchaKey,
                params = { username, password, captcha, captchaKey, enterpriseCode: 'gree' }
            login(params).then((res: any) => {
                let payload = res.payload
                if (res.msg === 'ok' && payload) {
                    setCookie('token', payload.access_token)
                    setCookie('userInfo', payload.userInfo)
                    navigate('/')
                } else {
                    message.error(res.msg)
                    _setData({ isDisabled: false })
                    getImages()
                }
            }).catch(() => {
                _setData({ isDisabled: false })
            })
        } else {
            message.error('请阅读并勾选《用户服务协议》和《隐私协议》!')
        }
    }
    const onFinishFailed = (errorInfo: any) => {
        const listName: any = {
            username: '用户名',
            password: '密码',
            captcha: '验证码'
        }
        for (let key in errorInfo.values) {
            if (!errorInfo.values[key]) {
                message.error(`请输入${listName[key]}`)
                break
            }
        }
    }
    // 修改数据
    const _setData = (val: any) => {
        let dataCopy = deepCopy(data)
        for (let key in val) dataCopy[key] = val[key]
        setData({...dataCopy})
    }
    // 获取验证码
    const getImages = () => {
        _setData({ loading: true })
        getImage().then((res: any) => {
            if (res.msg === 'ok') {
                _setData({ 
                    picturepath: res.payload.base64Img,
                    captchaKey: res.payload.captchaKey,
                    loading: false
                })
            }
        }).catch(() => {
            _setData({ loading: false })
        })
    }
    const getModal = (title: string) => {
        let modal = { title, visible: true, children: <h3>{ title }</h3> }
        _setData({ modal })
    }
    const onModalCancel = () => {
        let modal = { title: null, visible: false, children: null }
        _setData({ modal })
    }
    useEffect(() => {
        getImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={scssModules.box}>
            <video className='login-bg' autoPlay loop muted>
                <source src="https://encrypted-vtbn0.gstatic.com/video?q=tbn:ANd9GcTNrnyxp3CPFgj_DJGPAtzUB8qGkHdGUjRgIA" type="video/mp4"/>
            </video>
            <div className='login-content'>
                <Form ref={formRef} labelCol={{ span: 3 }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    {
                        renderList.map((item, index) => {
                            return <Form.Item name={item.name} label={item.label} rules={item.rules} key={index}>
                                <Input
                                    set-type={item.setType}
                                    maxLength={item.maxLength}
                                    icon-render={item.iconRender}
                                    placeholder={item.placeholder}
                                    replace={item.replace}
                                    suffix={item.suffix}
                                    addonAfter={
                                        item.name === 'captcha'
                                        &&
                                        <Spin spinning={data.loading}>
                                            <img onClick={() => getImages()} src={data.picturepath} style={
                                                { height: '30px', cursor: 'pointer'}
                                            } alt="验证码" title="点击获取最新验证码" />
                                        </Spin>
                                    }
                                />
                            </Form.Item>
                        })
                    }
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }} name="remember" valuePropName="checked">
                        <Checkbox><span className='btn' onClick={() => getModal('用户服务协议')}>《用户服务协议》</span>和<span className='btn' onClick={() => getModal('隐私协议')}>《隐私协议》</span>勾选代表已阅读且同意。</Checkbox>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                        <Button type="primary" htmlType="submit" style={{ width: '230px' }} loading={data.isDisabled}>
                            登录
                        </Button>
                        <Button disabled={data.isDisabled} onClick={() => navigate('/register')} style={{ width: '230px', marginLeft: 'calc(100% - 460px)' }}>注册</Button>
                    </Form.Item>
                </Form>
                <Modal width='800px' title={data.modal.title} visible={data.modal.visible} onCancel={onModalCancel} footer={null}>{data.modal.children}</Modal>
            </div>
        </div>
    )
}

export default connect(stateProps, dispatchProps)(Index)