import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => (
  <>
    <Header />
    <div className="sxrx-main-content">{children}</div>
    <Footer />
  </>
);

export default MainLayout; 