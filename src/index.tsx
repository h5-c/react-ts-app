import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from '@/store'
import Router from '@/router'

const reactApp = ReactDOM.createRoot(
    document.getElementById('app') as HTMLElement
)

reactApp.render(
    <Provider store={store}>
        <Router/>
    </Provider>
)
