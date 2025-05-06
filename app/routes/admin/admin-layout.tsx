import React from 'react'
import {Outlet} from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {MobileSidebar, NavItems} from "../../../components";



const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems />
                </SidebarComponent>
            </aside>
            <main className="children">
                <Outlet />
            </main>
        </div>
    )
}
export default AdminLayout
