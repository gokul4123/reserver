import React from 'react'
import './Hero.css'
import Image from '../Image/Image'


function Hero() {
  return (
    <div>
    <div className='hero container'>
        <div className="hero-text">
            <h1>R E S E R V E R</h1>
            <p className='para'>The Platform For A Ticket Auction</p>
        </div>
    </div>
    <Image/>
    </div>
  )
}

export default Hero