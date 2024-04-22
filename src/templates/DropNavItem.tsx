import { FC, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface DropNavItemProps {
  to: string;
  children: React.ReactNode;
  extraClasses?: string;
}

const DropNavItem: FC<DropNavItemProps> = ({ to, children }) => (
  <li className={`cursor-pointer px-6 py-2 text-black dark:text-white hover:bg-sky-600`}>
    <Link to={to}>{children}</Link>
    <span className="mt-[2px] h-[3px] w-[0px] rounded-full bg-sky-500 transition-all duration-300 group-hover:w-full"></span>
  </li>
);

export default DropNavItem;
