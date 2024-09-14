import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, Timestamp, writeBatch, doc } from 'firebase/firestore'; 
import './AddAuction.css';

const AddAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title || !description || !imageUrl || !endTime) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const batch = writeBatch(db); 

      // eslint-disable-next-line no-unused-vars
      const auctionsCollection = collection(db, 'auctions');
      const newAuctionRef = doc(collection(db, 'auctions'));
      const auctionData = {
        title,
        description,
        imageUrl,
        highestBid: 0,
        bidders: [],
        endTime: Timestamp.fromDate(new Date(endTime)),
        createdAt: Timestamp.fromDate(new Date()),
      };
      batch.set(newAuctionRef, auctionData);
      await batch.commit();

      setTitle('');
      setDescription('');
      setImageUrl('');
      setEndTime('');
      setError('');
    } catch (err) {
      console.error('Error adding auction:', err);
      setError(`Error adding auction: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='adding'>
      <h2 className='adder-text'>Add Auction</h2>
      <form onSubmit={handleSubmit} className='form-handle'>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '200px', height: 'auto' }} className='preview' />}
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className='timee'
        />
        <button type="submit" className='btn' disabled={loading}>
          {loading ? 'Adding...' : 'Add Auction'}
        </button>
        {error && <p>{error}</p>}
      </form>
      <h4 className='size'>* Image size should be under 1MB</h4>
    </div>
  );
};

export default AddAuction;
