// pages/logout.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    router.push('/login');
  }, [router]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
