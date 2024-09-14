import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './BidForm.css';

const BidForm = ({ auctionId, endTime, userName }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(null);
  const [message, setMessage] = useState('');
  const [isAuctionActive, setIsAuctionActive] = useState(true);

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const auctionRef = doc(db, 'auctions', auctionId);
        const docSnap = await getDoc(auctionRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentBid(data.highestBid || 0);
          
          const hasEnded = new Date() > new Date(endTime);
          setIsAuctionActive(!hasEnded);
        } else {
          setMessage('No auction found.');
          setIsAuctionActive(false);
        }
      } catch (error) {
        setMessage('Error fetching auction data: ' + error.message);
        setIsAuctionActive(false);
      }
    };

    if (auctionId) {
      fetchAuctionData();
    } else {
      setMessage('Invalid auction ID.');
      setIsAuctionActive(false);
    }
  }, [auctionId, endTime]);

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuctionActive) {
      setMessage('This auction has ended. You cannot place a bid.');
      return;
    }

    if (parseFloat(bidAmount) <= currentBid) {
      setMessage('Your bid must be higher than the current highest bid.');
      return;
    }

    try {
      const auctionRef = doc(db, 'auctions', auctionId);
      await updateDoc(auctionRef, {
        highestBid: parseFloat(bidAmount),
        bidders: arrayUnion({ name: userName, bid: parseFloat(bidAmount) }),
      });
      setMessage('Your bid has been placed successfully!');
      setBidAmount('');
    } catch (error) {
      setMessage('Error placing bid: ' + error.message);
    }
  };

  return (
    <div className='all'>
      {isAuctionActive ? (
        <form onSubmit={handleSubmit} className='form'>
          <h4>Enter the bid amount</h4>
          <input
            type="number"
            value={bidAmount}
            onChange={handleBidChange}
            placeholder="Enter your bid amount"
            min="0"
            required
            className='num-1'
          />
          <button type='submit' className='btn'>Place Your Bid</button>
        </form>
      ) : (
        <p>This auction has ended.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default BidForm;