import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ endTime, onAuctionEnd }) => {
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = () => {
    if (!endTime || !endTime.seconds) {
      console.error('Invalid endTime:', endTime);
      return { total: 0 };
    }

    const endDate = new Date(endTime.seconds * 1000); 
    const difference = endDate - new Date(); 
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor((difference/ (1000 *60*60*24))),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    } else {
      timeLeft = { total: 0 };
    }

    return timeLeft;
  };

  useEffect(() => {
    if (!endTime || !endTime.seconds) return; 

    const timer = setInterval(() => {
      const remainingTime = calculateTimeLeft();
      setTimeLeft(remainingTime);

      if (remainingTime.total <= 0) {
        clearInterval(timer);
        onAuctionEnd(); 
      }
    }, 1000);

    return () => clearInterval(timer); 
    // eslint-disable-next-line
  }, [endTime, onAuctionEnd]); 

  return (
    <div>
      {timeLeft.total > 0 ? (
        <p>
          Time left: {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
        </p>
      ) : (
        <p>Auction Ended</p>
      )}
    </div>
  );
};

export default CountdownTimer;
