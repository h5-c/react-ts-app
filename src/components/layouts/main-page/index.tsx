import ScrollView from 'react-custom-scrollbars'
import SwitchTag from './switch-tag'

export default function Index(props: {  class: string, contentPath: any }) {
    const ContentView = require(`@/views${props.contentPath}`).default
    return (
        <div className={props.class}>
            <SwitchTag/>
            <div className='main-content'>
                <ScrollView>
                    <ContentView/>
                </ScrollView>
            </div>
        </div>
    )
}
