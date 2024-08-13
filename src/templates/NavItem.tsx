import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    to?: string;
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
    return (

        <Link to={to!} className="text-white hover:text-sky-500 transition duration-300">{label}
            <li className="group flex cursor-pointer flex-col">
                <span className="mt-[2px] h-[3px] w-[0px] rounded-full bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
        </Link>
    );
};

export default NavItem;
