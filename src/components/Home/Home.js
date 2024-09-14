import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from '../Login/Login';
import AuctionList from '../AuctionList/AuctionList';
import AddAuction from '../AddAuction/AddAuction';
import Hero from '../Hero/Hero';
import './Home.css';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div>
        <nav className="dark-nav">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <ul className={`list ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/" className='link'>Home</Link></li>
            <li><Link to="/login" className='link'>Login / SignUp</Link></li>
            <li><Link to="/auctions" className='link'>Auctions</Link></li>
            <li> <Link to="/add-auction" className='link'>Add Auction</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auctions" element={<AuctionList />} />
          <Route path="/add-auction" element={<AddAuction />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Home;
