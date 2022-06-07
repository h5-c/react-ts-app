import Header from '@/components/layouts/header'
import MenuPage from '@/components/layouts/menu-page'
import MainPage from '@/components/layouts/main-page'
import modules from './layouts.module.scss'

export default function Index(props: { setRoutes: Function, contentPath: string }) {
    return (
        <div className={modules.content}>
            <Header class={modules.header} setRoutes={props.setRoutes} />
            <section className={modules.container}>
                <MenuPage class={modules.menu} />
                <MainPage class={modules.main} contentPath={props.contentPath} />
            </section>
        </div>
    )
}
