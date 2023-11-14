import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Chessboard from "chessboardjsx";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import "./bidding.css"; // Import the CSS file for styling

function Projects({ isConnected, startedGame, setFinalBidAmount }) {
  const [biddingAmount, setBiddingAmount] = useState("");
  const navigate = useNavigate();

  const handleBidChange = (event) => {
    let input = event.target.value;
  
    // Remove leading zeros if present
    if (input.length > 1 && input[0] === "0") {
      input = input.slice(1);
    }
  
    // Allow only a single zero if bidding amount is less than 1
    if (parseFloat(input) < 1 && input.length > 1 && input[0] === "0") {
      input = "0";
    }
  
    const amount = parseFloat(input);
    setBiddingAmount(isNaN(amount) ? "" : amount);
  };

  const handleBidSubmit = () => {
    Cookies.set("biddingAmount", biddingAmount);
    navigate("/CryptoChess/Chessboard");
    setFinalBidAmount(biddingAmount);
  };

  useEffect(() => {
    if (startedGame) {
      navigate("/CryptoChess/Chessboard");
    }
  }, [startedGame]);

  return (
    isConnected ? (
      <Container fluid className="project-section">
        <Particle />
        <Container>
          <h1 className="project-heading white-text">Bidding Platform</h1>
          <Row style={{ justifyContent: "center", paddingBottom: "0px" }}>
            <Col md={10} className="project-card">
              <div className="flex-center chessboard-container">
                <h2 className="heading_col white-text">Enter your bidding amount:</h2>
                <div className="input-wrapper">
                  <input
                    id="biddingAmount"
                    type="number"
                    value={biddingAmount}
                    onChange={handleBidChange}
                    placeholder="Enter amount"
                    title="Enter a positive bidding amount"
                    style={{ color: 'black' }} // Set text color to black
                  />
                  {(biddingAmount <= 0 || biddingAmount > 10) && (
                    <p className="error-text white-text">Bid Amount must be between 0 to 10.</p>
                  )}
                </div>
                <Button
                 disabled={biddingAmount <= 0 || biddingAmount > 10}
                 onClick={handleBidSubmit}
                className="fork-btn-inner"
              >
                 Start Chess Game
              </Button>

                 

              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    ) : (
      <Navigate to="/CryptoChess/Home" />
    )
  );
}

export default Projects;
