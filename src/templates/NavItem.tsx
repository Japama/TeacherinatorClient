import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
    to?: string;
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
    return (
        <li className="group flex cursor-pointer flex-col">
            <Link to={to!}>{label}</Link>
            <span className="mt-[2px] h-[3px] w-[0px] rounded-full bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
        </li>
    );
};

export default NavItem;
