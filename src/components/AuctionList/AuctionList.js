import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import BidForm from '../BidForm/BidForm';
import CountdownTimer from '../CountdownTimer';
import './AuctionList.css';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImageId, setEnlargedImageId] = useState(null);
  const [user, setUser] = useState(null);
  const [endedAuctions, setEndedAuctions] = useState(new Set()); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const auctionsCollection = collection(db, 'auctions');
    const auctionsQuery = query(auctionsCollection, orderBy('endTime', 'asc'));

    const unsubscribe = onSnapshot(auctionsQuery, (snapshot) => {
      const auctionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAuctions(auctionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching auctions:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAuctionEnd = async (auction) => {
    if (auction.bidders && auction.bidders.length > 0) {
      const highestBidder = auction.bidders.reduce((prev, current) =>
        prev.bid > current.bid ? prev : current
      );

      const auctionRef = doc(db, 'auctions', auction.id);
      await updateDoc(auctionRef, { winner: highestBidder.name });
      setAuctions(prevAuctions =>
        prevAuctions.map(a => a.id === auction.id ? { ...a, winner: highestBidder.name } : a)
      );

      console.log(`Auction ${auction.id} ended. Winner: ${highestBidder.name}`);
    } else {
      console.log(`Auction ${auction.id} ended. No bids were placed.`);
    }
    setEndedAuctions(prev => new Set(prev).add(auction.id)); 
  };

  const toggleImageSize = (id) => {
    setEnlargedImageId(enlargedImageId === id ? null : id);
  };

  const hasAuctionEnded = (endTime) => {
    return new Date() > new Date(endTime);
  };

  if (loading) {
    return <p>Loading auctions...</p>;
  }

  return (
    <div className='container'>
      <h2>Active Auctions</h2>
      <ul className='auction-list'>
        {auctions.map(auction => (
          <li key={auction.id} className='auction-item ticket'>

            <div className='left-side'>
              {auction.imageUrl && (
                <img
                  src={auction.imageUrl}
                  alt={auction.title}
                  className={`auction-image ${enlargedImageId === auction.id ? 'enlarged' : ''}`}
                  onClick={() => toggleImageSize(auction.id)}
                />
              )}
            </div>
            <div className='right-side'>
              <h3>{auction.title}</h3>
              <p>{auction.description}</p>
              <p>Current Highest Bid: ${auction.highestBid || 0}</p>

              <CountdownTimer endTime={auction.endTime} onAuctionEnd={() => handleAuctionEnd(auction)} />
              {!hasAuctionEnded(auction.endTime) && !endedAuctions.has(auction.id) && (
                <>
                  <button
                    onClick={() => setSelectedAuction(auction.id)}
                    className="button-36"
                  >
                    Want to place a bid?
                  </button>
                  {selectedAuction === auction.id && (
                    <BidForm auctionId={auction.id} endTime={auction.endTime} userName={user?.displayName} />
                  )}
                </>
              )}

<h4>Bidders:</h4>
  <ul className='bidders'>
    {auction.bidders && auction.bidders.length > 0 ? (
      auction.bidders.slice(-4).map((bidder, index) => ( 
        <li key={index} className='bid-each'>
          {bidder.name} - ${bidder.bid}
        </li>
      ))
    ) : (
      <p>No bids placed yet.</p>
    )}
  </ul>

              {auction.winner && <p>Winner: {auction.winner}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionList;
