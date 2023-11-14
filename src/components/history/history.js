import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import Particle from "../Particle";
import meta from "../../Assets/Projects/meta.png";
import Cookies from "js-cookie";
import { useNavigate, Navigate } from "react-router-dom";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import './history.css';
import Loader from "../Loader/Loader";
import Button from "react-bootstrap/Button";

function Projects({isConnected, getHistory, getBetAmount}) {
    const [chess] = useState(
        new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
      );

    const [amountBet, setAmountBet] = useState(null)
    const [moveNum, setMoveNum] = useState(0);
    const [fen, setFen] = useState(chess.fen())
    const [moves, setMoves] = useState([]); // playerMoveSrc, playerMoveDst, AIMoveSrc, AIMoveDst, ...
    useEffect(() => {
        const fn = async() => {
            const amtBet = await getBetAmount();
            const moveHistory = await getHistory();
            setAmountBet(Number(amtBet))
            setMoves(moveHistory.match(/.{1,2}/g) || []);
        }

        fn()
    }, [])

    useEffect(() => {
        for (let i = 0; i < moveNum * 2; i+=2) {
            chess.move({
                from: moves[i],
                to: moves[i + 1],
                promotion: "q",
            })
        }
        setFen(chess.fen())

    }, [moveNum])

    const setMoveNumWrapper = useCallback((num) => {
        setMoveNum(num)
        chess.reset()
    }, [])


    if (amountBet == null) {
        return (
            <div className="flex-center history-container">
                <Loader/>
            </div>
        )
    }

    console.log(moveNum)

  return (
    isConnected ? 
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading"></h1>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={10} className="project-card">
          <div className="flex-center history-container">
            <div>Amount Bet: {amountBet}</div>
            <Chessboard
                width={400}
                position={fen}
            />
            <div style={{ paddingTop: "10px" }}>
                <Button  disabled = {moveNum === 0} onClick = {() => setMoveNumWrapper(moveNum - 1)}>Prev</Button>
                <text style={{ paddingRight: "10px", paddingLeft: "10px" }}>{moveNum}</text>
                <Button disabled = {moveNum === moves.length / 2} onClick = {() => setMoveNumWrapper(moveNum + 1)}>Next</Button>
            </div>
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
