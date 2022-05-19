// js三方库类型声明
declare module 'react-custom-scrollbars' {
    const content: any
    export = content
}

declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
}
