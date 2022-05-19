import { get, post } from '@/api/request'

// 获取验证码
export const getImage = () => get(`/login/getImage`)

// 登录
export const login = (params: object) => post(`/login/loging`, params)

// 获取用户数据
export const getPartner = () => get(`/customer/partner/getPartner`)

// 获取菜单
export const getMenuByAppId = (params: object) => get(`/application/getMenuByAppId`, params)