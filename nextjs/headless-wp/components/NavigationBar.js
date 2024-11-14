// components/NavigationBar.js
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';

const NavigationBar = () => {
  const { getTotalItems, getTotalPrice } = useContext(CartContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = localStorage.getItem('username');
      const storedPassword = localStorage.getItem('password');
      setIsLoggedIn(!!storedUsername && !!storedPassword);

      if (storedUsername) {
        setUsername(storedUsername);
        try {
          const response = await fetch('/api/wordpress-proxy?endpoint=users/me', {
            headers: {
              'Content-Type': 'application/json',
              'x-username': storedUsername,
              'x-password': storedPassword,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch user data');

          const userData = await response.json();
          setAvatarUrl(userData.avatar_urls['48']); // Using the 48px size avatar URL
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setIsLoggedIn(false);
    setUsername('');
    setAvatarUrl('');
    router.push('/login');
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link href="/">
          <a>Probarra</a>
        </Link>
      </h1>
      <div className="flex items-center space-x-4">
        <Link href="/cart">
          <a className="hover:text-gray-300 flex items-center">
            <span className="mr-2">🛒</span> (${getTotalPrice().toFixed(2)})
          </a>
        </Link>
        {isLoggedIn ? (
          <>
            <Link href="/orders">
              <a className="hover:text-gray-300">Order History</a>
            </Link>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <User
                  as="button"
                  name={username}
                  avatarProps={{
                    src: avatarUrl,
                    className: "w-8 h-8", // Adjusted size
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{username}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <Link href="/login">
            <a className="hover:text-gray-300">Login</a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
