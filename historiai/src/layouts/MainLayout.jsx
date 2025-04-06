import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header />
      <main className="flex-grow container-custom py-8">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
