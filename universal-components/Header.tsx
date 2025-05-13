import React, {type FC} from 'react'
import {Link, useLocation} from "react-router";
import {cn} from "../lib/utils";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

interface HeaderProps {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
}

const Header: FC<HeaderProps> = ({title, description, ctaText, ctaUrl}) => {
    const { pathname } = useLocation();
    return (
        <header className="header">
            <article>
                <h1 className={cn("text-dark-100", pathname === "/" ? "text-2xl md:text-4xl font-bold" : "text-xl md:text-2xl font-bold")}>{title}</h1>
                <p className={cn("text-gray-100 font-normal", pathname === "/" ? "text-base md:text-lg" : "text-sm md:text-lg")}>{description}</p>
            </article>

            {ctaText && ctaUrl && (
                <Link to={ctaUrl}>
                    <ButtonComponent type='button' className='button-class !h-11 !w-full md:w-[240px]'>
                        <img src="/assets/icons/plus.svg" alt="plus icon" className='size-5' />
                        <span className='text-white p-16-semibold'>{ctaText}</span>
                    </ButtonComponent>
                </Link>
            )}
        </header>
    )
}
export default Header
