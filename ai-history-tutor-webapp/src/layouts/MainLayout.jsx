import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header />
      <main className="flex-grow container-custom py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
