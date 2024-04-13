/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
            Welcome to Debug Experts, your go-to platform for resolving errors
            across various fields including MERN Stack, Mean Stack, and more.{" "}
            <br />
            Our team comprises highly experienced experts dedicated to swiftly
            and effectively solving any errors you encounter, ensuring seamless
            functionality in your projects and applications.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero