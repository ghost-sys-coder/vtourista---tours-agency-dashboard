import React from 'react'
import {Outlet, redirect} from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {MobileSidebar, NavItems} from "universal-components";
import { account } from '@/appwrite/client';
import { getExistingUser, storeUserData } from '@/appwrite/auth';


// implement a user check before rendering the layout

export async function clientLoader(){
    try {
        const user = await account.get();

        if (!user.$id) return redirect("/sign-in");

        const existingUser = await getExistingUser(user.$id);

        if (existingUser?.status === "user") {
            return redirect("/");
        }

        return existingUser?.$id ? existingUser : storeUserData();
    } catch (error) {
        console.error('Error loading client:', error);
        return redirect("/sign-in")
    }
}


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
