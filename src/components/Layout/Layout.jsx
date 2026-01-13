import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children, currentPage, setCurrentPage, player }) => {
  return (
    <div className="min-h-screen bg-system-dark text-white">
      <Header player={player} />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
