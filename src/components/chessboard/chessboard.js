import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useNavigate, Navigate } from "react-router-dom";
import Preloader from "../Pre";
import "./chessboard.css";
import Loader from "../Loader/Loader";
import Button from "react-bootstrap/Button";

function Projects(props) {
   
  
    const { isConnected, startedGame, balance, move, endGame, restartGame, setStartedGame } = props;

    if (!startedGame) {
      return (
        <div className="flex-center chessboard-container">
         <Loader/>
        </div>
      )
    }
    return (
        <ChessBoardInternal
          isConnected={isConnected}
          balance={balance}
          move={move}
          endGame={endGame}
          restartGame={restartGame}
          setStartedGame={setStartedGame}
        />
      );
    };
    
    const ChessBoardInternal = (props) => {
      const {isConnected, move, endGame, restartGame, setStartedGame} = props
      const [isLoading, setIsLoading] = useState(false);
      const [chess] = useState(
        new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
      );
    
      const [allMovesFrom, setAllMovesFrom] = useState([]);
      const [allMovesTo, setAllMovesTo] = useState([]);
      const [fen, setFen] = useState(chess.fen());
      const [selectedSquare, setSelectedSquare] = useState(null);
      const [hoveredSquare, setHoveredSquare] = useState(null);
    
      const [capturedPieces, setCapturedPieces] = useState({});
      const [validMoves, setValidMoves] = useState([]);
    
      const [gameStatus, setGameStatus] = useState("");
      const [winner, setWinner] = useState(null);
      const [errorMessage, setErrorMessage] = useState("");
    
      const navigate = useNavigate()
    
      useEffect(() => {
        if (chess.isGameOver()) {
          const winner = chess.turn() === "w" ? "Black" : "White";
          setWinner(winner);
          setGameStatus(`Checkmate! ${winner} wins!`);
        } else if (chess.isDraw()) {
          setGameStatus("Draw! Game Over.");
        } else if (chess.isStalemate()) {
          setGameStatus("Stalemate! Game Over.");
        } else if (chess.isThreefoldRepetition()) {
          setGameStatus("Threefold Repetition! Game Over.");
        }
      }, [chess]);
    
      const handleSquareMouseOver = (square) => {
        const validMoves = chess.moves({ square: square });
    
        if (validMoves.length > 0) {
          setHoveredSquare(square);
        }
      };
    
      const handleSquareMouseOut = () => {
        setHoveredSquare(null);
      };
    
      const squareStyling = ({ pieceSquare, history }) => {
        const sourceSquare = history.length && history[history.length - 1].from;
        const targetSquare = history.length && history[history.length - 1].to;
      
        const validMoves = chess.moves({ square: pieceSquare });
        const validMoveSquares = validMoves.map((move) => move.to);
      
        const highlightStyles = validMoveSquares.reduce((acc, curr) => {
          acc[curr] = {
            backgroundColor: "rgba(0, 128, 0, 0.4)",
          };
          return acc;
        }, {});
      
        return {
          [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
          ...(history.length && {
            [sourceSquare]: {
              backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
          }),
          ...(history.length && {
            [targetSquare]: {
              backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
          }),
          ...highlightStyles,
        };
      };
      const handleMove = async (x, y, new_x, new_y) => {
        try {
          const from = `${x}${y}`
          const to = `${new_x}${new_y}`
          const chessMove = chess.move({
            from: from,
            to: to,
            promotion: "q",
          });
    
           // Add the player's move to the list of all moves
           setAllMovesFrom((prevMoves) => [...prevMoves, from])
           setAllMovesTo((prevMoves) => [...prevMoves, to])
    
          // Check if the move is valid
          if (!chessMove) {
            setErrorMessage("Invalid move. Please try again.");
            return;
          }
    
          // Clear any previous error message
          setErrorMessage("");
    
          // Check for captures
          const capturedPiece = chess.get(`${new_x}${new_y}`);
          if (capturedPiece) {
            setCapturedPieces((prevCaptured) => ({
              ...prevCaptured,
              [capturedPiece]: (prevCaptured[capturedPiece] || 0) + 1,
            }));
          }
    
          setFen(chess.fen());
          updateCapturedPieces();
          // /* await */ move(from, to)
          // Check for winner after each move
          if (chess.isGameOver()) {
            const winner = chess.turn() === "w" ? "Black" : "White";
            const isPlayerWin = winner === "White"
            setWinner(winner);
            setGameStatus(`Checkmate! ${winner} wins!`);
            setIsLoading(true)
            await move([...allMovesFrom, from], [...allMovesTo, to])
            await endGame(isPlayerWin)
            setIsLoading(false)
          } else {
            setTimeout(async() => {
              const moves = chess.moves();
              if (moves.length > 0) {
                const computerMove = getBestMove();
                const computerMoveResult = chess.move(computerMove);
                // Add the computer's move to the list of all moves
    
                let lastMove = chess.history({verbose: true})
                lastMove = lastMove[lastMove.length - 1]
                setAllMovesFrom((prevMoves) => [...prevMoves, lastMove.from])
                setAllMovesTo((prevMoves) => [...prevMoves, lastMove.to])
    
                // Check for captures in computer move
                if (computerMoveResult && computerMoveResult.captured) {
                  setCapturedPieces((prevCaptured) => ({
                    ...prevCaptured,
                    [computerMoveResult.captured]: (prevCaptured[computerMoveResult.captured] || 0) + 1,
                  }));
                }
    
                setFen(chess.fen());
                updateCapturedPieces();

                // Check for winner after computer move
                if (chess.isGameOver()) {
                  const winner = chess.turn() === "w" ? "Black" : "White";
                  const isPlayerWin = winner === "White"
                  setWinner(winner);
                  setGameStatus(`Checkmate! ${winner} wins!`);
                  setIsLoading(true)
                  await move([...allMovesFrom, from], [...allMovesTo, to])
                  await endGame(isPlayerWin)
                  setIsLoading(false)
                }
              }
            }, 300);
          }
        } catch (error) {
          console.error("Error:", error.message);
          setErrorMessage("Invalid move. Please try again.");
        }
      };

      const getBestMove = () => {
        const moves = chess.moves();
        return moves[Math.floor(Math.random() * moves.length)];
      };
    
      const updateCapturedPieces = () => {
        const captured = chess
          .history({ verbose: true })
          .filter(move => move.captured)
          .reduce((acc, move) => ({ ...acc, [move.captured]: (acc[move.captured] || 0) + 1 }), {});
        setCapturedPieces((prevCaptured) => ({ ...prevCaptured, ...captured }));
      };
    
      const handleSquareClick = (square) => {
        const moves = chess.moves({ square: square });
    
        if (moves.length > 0) {
          setSelectedSquare(square);
          setValidMoves(moves); // Store valid moves in state
        }
      };
      const highlightSquare = (square) => {
        const validMoves = chess.moves({ square: square });
        const squaresToHighlight = validMoves.map((move) => move.to);
      
        const highlightStyles = squaresToHighlight.reduce((acc, curr) => {
          acc[curr] = {
            backgroundColor: "rgba(0, 128, 0, 0.4)",
          };
          return acc;
        }, {});
      
        return {
          ...highlightStyles,
          [square]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        };
      };
    
      useEffect(() => {
        const savedFen = localStorage.getItem("chessFen");
        if (savedFen) {
          chess.load(savedFen);
        }
        setFen(chess.fen());
      }, []);
    
      // Save the current FEN to local storage on each move
      useEffect(() => {
        localStorage.setItem("chessFen", chess.fen());
      }, [fen]);
    
      const handleNewGame = async() => {
        chess.reset();
        setFen(chess.fen());
        setGameStatus("");
        setWinner(null);
        setCapturedPieces({});
        setStartedGame(false)
        localStorage.removeItem("chessFen");
        await restartGame()
        navigate("/CryptoChess/bidding")
      };
    
      const handleQuitGame = async () => {
        await handleNewGame();
      };
    
  return (
    isConnected ? 
    <Container fluid className="project-section">
      <Particle />
      <Container>
      <div className="flex-center chessboard-container">
    <h1>Play Against AI</h1>
    <div className="game-status">{gameStatus}</div>
    {winner && <div className="winner">Winner: {winner}</div>}
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    <div className="warning-message">Warning: You will lose your money bet if you restart the game before it ends</div>
    { !isLoading &&
    <div style={{ paddingBottom: "10px" }}>
      <Button className="fork-btn-inner" onClick={async() => await handleNewGame()}>New Game</Button>
    </div>
    }
    {isLoading ?
      <div className="chessboard-container">
        <div>Saving result</div>
        <Loader />
      </div>
      :
      <div className="chessboard-wrapper">
      <Chessboard
          width={400}
          position={fen}
          onDrop={async(move) =>
            await handleMove(
              move.sourceSquare[0],
              move.sourceSquare[1],
              move.targetSquare[0],
              move.targetSquare[1]
            )
          }
          onMouseOverSquare={(square) => handleSquareMouseOver(square)}
          onMouseOutSquare={() => handleSquareMouseOut()}
          squareStyling={(square) => (selectedSquare ? highlightSquare(selectedSquare) : squareStyling(square))}
          onSquareClick={(square) => handleSquareClick(square)}
        />
      </div>
    }
    </div>
      </Container>
    </Container>
        :
        <Navigate to="/CryptoChess/Home" />
  );
}

export default Projects;
