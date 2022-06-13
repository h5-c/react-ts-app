import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from '@/store'
import Router from '@/router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

const reactApp = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
)

reactApp.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <Router/>
        </ConfigProvider>
    </Provider>
)
