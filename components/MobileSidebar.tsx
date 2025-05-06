// @ts-nocheck
import React from 'react'
import {Link} from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {NavItems} from "./index";

const MobileSidebar = () => {
    let sidebar: SidebarComponent;

    const toggleSidebar = ()=> {
        sidebar.toggle();
    }

    return (
        <div className="mobile-sidebar wrapper">
            <header>
                <Link to="/" className="link-logo">
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]"/>
                    <h1>VTourista</h1>
                </Link>
                <button type="button" onClick={toggleSidebar}>
                    <img src="/assets/icons/menu.svg" alt="menu" className="size-6"/>
                </button>
            </header>

            <SidebarComponent
                width={270}
                ref={(Sidebar: any) => sidebar = Sidebar}
                created={()=> sidebar.hide()}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type="over"
            >
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    )
}
export default MobileSidebar