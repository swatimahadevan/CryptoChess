import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Chessboard from "chessboardjsx";
import Cookies from "js-cookie";



function Projects({isConnected, startedGame, setFinalBidAmount}) {
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
      navigate("/CryptoChess/Chessboard");
      setFinalBidAmount(biddingAmount)
    };
  
    useEffect(() => {
      if (startedGame) {
        navigate("/CryptoChess/Chessboard");
      }
    }, [startedGame]);
  return (
    isConnected ?
    <Container fluid className="project-section">
      <Particle />
      <Container>
      <h1 className="project-heading">Bidding Platform</h1>
        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          <Col md={10} className="project-card">
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
      <button isDisabled={biddingAmount <= 0 && biddingAmount > 10} onClick={handleBidSubmit}>
        Start Chess Game
      </button>
    </div>
    </Col>
    </Row>
      </Container>
    </Container>
        :
        <Navigate to="/CryptoChess/Home" />
  );
}

export default Projects;
