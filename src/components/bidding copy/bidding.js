// Bidding.js
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Chessboard from "chessboardjsx";
import Cookies from "js-cookie";

import "./bidding.css"; // Import your CSS file

const Bidding = ({isConnected, startedGame, setFinalBidAmount}) => {
  const [biddingAmount, setBiddingAmount] = useState("");
  const navigate = useNavigate();

  const handleBidChange = (event) => {
    let input = event.target.value;
  
    // Remove leading zero if present
    if (input.length > 1 && input[0] === '0') {
      input = input.slice(1);
    }
  
    const amount = parseFloat(input);
    setBiddingAmount(isNaN(amount) ? 0 : amount);
  };
  

  const handleBidSubmit = () => {
    Cookies.set("biddingAmount", biddingAmount);
    navigate("/EE4032ChessGame/chessboard");
    setFinalBidAmount(biddingAmount)
  };

  useEffect(() => {
    if (startedGame) {
      navigate("/EE4032ChessGame/chessboard");
    }
  }, [startedGame]);

  return (
    isConnected ?
    <div className="flex-center chessboard-container">
      <h2 className="heading_col">Enter your bidding amount:</h2>
      <label htmlFor="biddingAmount">Bidding Amount:</label>
      <input
        id="biddingAmount"
        type="number"
        value={biddingAmount}
        onChange={handleBidChange}
        placeholder="Enter amount"
        title="Enter a positive bidding amount"
      />
      {(biddingAmount <= 0 || biddingAmount > 10) && (
        <p className="error-text">Bid Amount must be between 0 to 10.</p>
      )}
    </div>
    :
    <Navigate to="/EE4032ChessGame/" />
  );
};

export default Bidding;
