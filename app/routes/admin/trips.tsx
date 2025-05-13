import { Header } from '@/universal-components'
import React from 'react'

const Trips = () => {
    return (
        <main className='all-trips wrapper'>
            <Header
                title='All Trips'
                description='View and edit AI-generated travel plans'
                ctaText='Create New Trip'
                ctaUrl='/trips/create'
            />
        </main>
    )
}

export default Trips