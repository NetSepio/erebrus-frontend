import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';

interface UserDropdownProps {
  avatarUrl: string;
  handlePasetoClick: () => void;
  handleDeleteCookie: () => void;
  paseto: string | null;
}

const MenuItem: React.FC<{
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ href, onClick, children }) => {
  const content = (
    <button
      className="group flex w-full items-center rounded-md px-2 py-2 text-md text-white hover:bg-gray-900"
      onClick={onClick}
    >
      {children}
    </button>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

const UserDropdown: React.FC<UserDropdownProps> = ({
  avatarUrl,
  handlePasetoClick,
  handleDeleteCookie,
  paseto,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left z-10">
      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <img src={avatarUrl} alt="Avatar" className="w-10 ml-auto" />
      </Menu.Button>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgba(32, 37, 58, 1), rgba(66, 79, 127, 1))',
          }}
        >
          <div className="px-1 py-1">
            <Menu.Item>
              <MenuItem href="/profile">Profile</MenuItem>
            </Menu.Item>
            <Menu.Item>
              <MenuItem href="/usernodes">My Nodes</MenuItem>
            </Menu.Item>
          </div>
          {paseto && (
            <div className="px-1 py-1 ">
              <Menu.Item>
                <MenuItem onClick={handlePasetoClick}>Mobile Auth</MenuItem>
              </Menu.Item>
            </div>
          )}
          <div className="px-1 py-1 ">
            <Menu.Item>
              <MenuItem onClick={handleDeleteCookie}>Log out</MenuItem>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;