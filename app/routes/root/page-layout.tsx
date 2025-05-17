import React from 'react'
import { Outlet } from 'react-router'

const PageLayout = () => {
    return (
        <main>
            <Outlet />
        </main>
    )
}

export default PageLayout