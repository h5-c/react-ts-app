import Header from '@/components/layouts/header'
import MenuPage from '@/components/layouts/menu-page'
import MainPage from '@/components/layouts/main-page'
import scssModules from './layouts.module.scss'

export default function Index(props: { contentPath: string }) {
    return (
        <div className={scssModules.content}>
            <Header class={scssModules.header} />
            <section className={scssModules.container}>
                <MenuPage class={scssModules.menu} />
                <MainPage class={scssModules.main} contentPath={props.contentPath} />
            </section>
        </div>
    )
}
