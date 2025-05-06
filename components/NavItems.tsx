import React from 'react'
import {Link, NavLink} from "react-router";
import {sidebarItems} from "~/constants";
import {cn} from "../lib/utils";

const NavItems = ({handleClick}: {handleClick?: ()=> void}) => {
    const user = {
        name: "Tamale Frank",
        email: "support@veilcode.com",
        imageUrl: "/assets/images/david.webp"
    }
    return (
        <section className="nav-items">
            <Link to="/" className="link-logo">
                <img src="/public/assets/icons/logo.svg" alt="logo" className="size-[30px]"/>
                <h1>VTourista</h1>
            </Link>

            <div className="container">
                <nav>
                    {sidebarItems.map(({id, icon, label, href}) => (
                        <NavLink to={href} key={id}>
                            {({isActive}: { isActive: boolean }) => (
                                <div onClick={handleClick} className={cn("group nav-item", {"bg-primary-100 !text-white": isActive})}>
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`group-hover:brightness-0 size-0 group-hover: ${isActive ? "brightness-0 invert" : "text-dark-200"}`}
                                    />
                                    <span>{label}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <footer className="nav-footer absolute bottom-0 left-4 right-4">
                    <img src={user?.imageUrl || "/assets/images/david.webp"} alt={user?.name || "David"}/>
                    <article>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                    </article>
                    <button onClick={()=> {console.log("logout")}} className="cursor-pointer">
                        <img src="/assets/icons/logout.svg" alt="logout" className="size-6"/>
                    </button>
                </footer>
            </div>
        </section>
    )
}
export default NavItems
