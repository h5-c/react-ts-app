import React, { useEffect } from 'react'
import ScrollView from 'react-custom-scrollbars'

export default function Index() {
    useEffect(() => {
        console.log(ScrollView)
    },)
    return (
        <ScrollView>register</ScrollView>
    )
}
