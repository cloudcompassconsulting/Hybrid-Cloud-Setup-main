// components/Layout.js
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <main className="p-4 bg-white text-black">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
