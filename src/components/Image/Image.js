import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import image from "../../assets/tickets.jpg";
import './Image.css';

function Image() {
  const navigate = useNavigate(); 

  const goToAuctions = () => {
    navigate('/auctions'); 
  };

  return (
    <div className="image-container">
      <div className="image-wrapper">
        <img src={image} alt="Tickets" />
      </div>
      <div className="text-wrapper">
        <h3>Missed a concert or a FDFS movie ticket?</h3>
        <button className="btn" onClick={goToAuctions}>
          Go To Auctions
        </button>
      </div>
    </div>
  );
}

export default Image;
