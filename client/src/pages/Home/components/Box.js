import React from 'react';
import './Box.css';


export default function Box() {
  return (
    <>
      <div >
        <div class="main">
          <div class="heading">
            <h1>Cut Waste, Fatten Wallets: Save Food, Save Money!</h1>
            <p>
              We believe food should be more than just sustenance, it's an experience that nourishes your soul. Our passionate chefs, inspired by traditional recipes, carefully curate a menu that bursts with flavor and love.
            </p>

            <div class="buttons">
              <button onclick="location.href='#'">Get Started</button>
              <button onclick="location.href='#'">About Us</button>
            </div>
          </div>
          {/* <div class="circle">
        <img src={bg}/>
      </div> */}
        </div>

      </div>
    </>
  );
}