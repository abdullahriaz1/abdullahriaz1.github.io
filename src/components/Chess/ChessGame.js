import React, { useEffect, useState } from "react";
import { Chess as ChessEngine } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Preload move audio (used for any valid move)
const moveSound = new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3");

// Custom piece set (Chess.com "Neo")
function buildCustomPieces() {
  const pieceImages = {
    wP: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png",
    wR: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png",
    wN: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png",
    wB: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png",
    wQ: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png",
    wK: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png",
    bP: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png",
    bR: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png",
    bN: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png",
    bB: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png",
    bQ: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png",
    bK: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png",
  };

  const customPieces = {};
  Object.keys(pieceImages).forEach((piece) => {
    customPieces[piece] = ({ squareWidth }) => (
      <img
        src={pieceImages[piece]}
        alt={piece}
        style={{
          width: squareWidth,
          height: squareWidth,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    );
  });
  return customPieces;
}

export default function ChessGame() {
  // -------------------------------------------------------------------------
  // 1) FancyTimer Sub-component
  // -------------------------------------------------------------------------
  /**
   * @param {number} time    - The time (in seconds) for the player.
   * @param {string} label   - Label (White or Black).
   * @param {boolean} isActive - Whether this timer is for the current player's turn.
   * @param {boolean} gameOver - Whether the game has ended.
   * @param {string} color   - Timer stroke color.
   */
  const FancyTimer = ({ time, label, isActive, gameOver, color }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Circle details
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    // If not active or the game is over, keep circle fully filled (offset = 0).
    // If active, we animate from 'circumference' -> 0 each second.
    const strokeDashOffset = !gameOver && isActive ? circumference : 0;
    const animationStyle =
      !gameOver && isActive ? "progressAnimation 1s linear forwards" : "none";

    return (
      <div className="timer-container">
        <div className="timer-label" style={{ color: color || "#3498db" }}>
          {label}
        </div>
        <style>
          {`
            @keyframes progressAnimation {
              from { stroke-dashoffset: ${circumference}; }
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
        <svg width="150" height="150" key={time} style={{ overflow: "visible" }}>
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke={color || "#3498db"}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashOffset}
            style={{
              animation: animationStyle,
              filter: `drop-shadow(0 0 10px ${color || "#3498db"})`,
            }}
          />
          <text
            x="75"
            y="85"
            textAnchor="middle"
            fontSize="24"
            fill="#ffffff"
            fontFamily="Open Sans, sans-serif"
          >
            {formattedTime}
          </text>
        </svg>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // 2) Chess Logic & React State
  // -------------------------------------------------------------------------
  const [game, setGame] = useState(new ChessEngine());
  const [moveList, setMoveList] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [squareStyles, setSquareStyles] = useState({});
  const [hoveredSquare, setHoveredSquare] = useState(null);

  // Timers (in seconds)
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);

  // Dynamically size the board
  const getBoardWidth = () => Math.min(window.innerWidth * 0.8, 600);
  const [boardWidth, setBoardWidth] = useState(getBoardWidth());

  // Format the SAN move list into rows (move#, White, Black)
  const formatMoveHistory = (moves) => {
    const rows = [];
    for (let i = 0; i < moves.length; i += 2) {
      rows.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1] || "",
      });
    }
    return rows;
  };

  // -------------------------------------------------------------------------
  // 3) Effects: Timers & Resize
  // -------------------------------------------------------------------------
  // Resize
  useEffect(() => {
    const handleResize = () => setBoardWidth(getBoardWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timers (increment the current player's clock every second)
  useEffect(() => {
    const timerId = setInterval(() => {
      if (!game.isGameOver()) {
        if (game.turn() === "w") {
          setWhiteTime((t) => t + 1);
        } else {
          setBlackTime((t) => t + 1);
        }
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [game]);

  // -------------------------------------------------------------------------
  // 4) Move Handlers (Drag-n-Drop, Click)
  // -------------------------------------------------------------------------
  // Drag-n-drop
  const onDrop = (sourceSquare, targetSquare) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (!move) {
        toast.error("Invalid move!");
        return false;
      }
      // Update game
      setGame(new ChessEngine(game.fen()));
      setMoveList((prev) => [...prev, move.san]);

      // Play sound
      moveSound.currentTime = 0;
      moveSound.play().catch(() => {});

      // Clear selection
      setSelectedSquare(null);
      setSquareStyles({});
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Move error occurred.");
      return false;
    }
  };

  // Click-based moves
  const onSquareClick = (square) => {
    if (selectedSquare) {
      const possibleMoves = game.moves({ square: selectedSquare, verbose: true });
      const moveCandidate = possibleMoves.find((m) => m.to === square);
      if (moveCandidate) {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });
        if (move) {
          setGame(new ChessEngine(game.fen()));
          setMoveList((prev) => [...prev, move.san]);
          // Sound
          moveSound.currentTime = 0;
          moveSound.play().catch(() => {});
        }
        // Clear selection
        setSelectedSquare(null);
        setSquareStyles({});
        return;
      }
    }

    // If not making a move, select a piece if it's the current player's
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square, verbose: true });
      if (!moves.length) {
        setSelectedSquare(null);
        setSquareStyles({});
        return;
      }
      const newStyles = {};
      newStyles[square] = { background: "rgba(255, 255, 0, 0.4)" };
      moves.forEach((m) => {
        newStyles[m.to] = { background: "rgba(0, 255, 0, 0.4)" };
      });
      setSelectedSquare(square);
      setSquareStyles(newStyles);
    } else {
      // Deselect
      setSelectedSquare(null);
      setSquareStyles({});
    }
  };

  // Hover
  const onSquareMouseEnter = (square) => setHoveredSquare(square);
  const onSquareMouseLeave = () => setHoveredSquare(null);

  const computedSquareStyles = { ...squareStyles };
  if (hoveredSquare) {
    computedSquareStyles[hoveredSquare] = {
      ...(computedSquareStyles[hoveredSquare] || {}),
      background: "rgba(255, 255, 0, 0.3)",
    };
  }

  // -------------------------------------------------------------------------
  // 5) Reset
  // -------------------------------------------------------------------------
  const resetGame = () => {
    setGame(new ChessEngine());
    setMoveList([]);
    setSelectedSquare(null);
    setSquareStyles({});
    setWhiteTime(0);
    setBlackTime(0);
  };

  // -------------------------------------------------------------------------
  // 6) Status
  // -------------------------------------------------------------------------
  let status = "";
  if (game.isCheckmate()) {
    status = "Checkmate! Game over.";
  } else if (game.isStalemate()) {
    status = "Stalemate! Game over.";
  } else if (game.isDraw()) {
    status = "Draw! Game over.";
  } else {
    status = `Turn: ${game.turn() === "w" ? "White" : "Black"}${
      game.isCheck() ? " (in check)" : ""
    }`;
  }
  const gameOver = game.isGameOver();

  // -------------------------------------------------------------------------
  // 7) Determine which timer is active
  // -------------------------------------------------------------------------
  const whiteActive = !gameOver && game.turn() === "w";
  const blackActive = !gameOver && game.turn() === "b";

  // -------------------------------------------------------------------------
  // 8) Render
  // -------------------------------------------------------------------------
  return (
    <>
      <style>
        {`
          /* Single uniform font: Open Sans */
          @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");

          body {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            background-color: #2C3E50; /* entire page background */
          }

          .chess-game-container {
            background-color: #34495E;
            min-height: 100vh;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
          }

          /* Title: "Chess Arcade" */
          .title {
            font-size: 2rem;
            margin-bottom: 2rem;
            text-align: center;
          }

          .main-layout {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;
            width: 100%;
            max-width: 1200px;
            gap: 2rem;
          }

          .left-column {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .board-container {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            overflow: hidden;
          }

          .right-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .timers-row {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            justify-content: center;
          }

          .timer-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .timer-label {
            font-size: 1.2rem;
            margin-bottom: 5px;
          }

          .move-list-container {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
            width: 100%;
            max-width: 400px;
            text-align: left;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
          }

          .move-list-container h3 {
            font-size: 1.3rem;
            margin-top: 0;
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .move-list-container table {
            width: 100%;
            border-collapse: collapse;
          }
          .move-list-container th,
          .move-list-container td {
            padding: 6px;
            text-align: left;
            font-size: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .move-list-container tr:last-child td {
            border-bottom: none;
          }

          .status-container {
            margin-top: 1rem;
          }
          .status-text {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .reset-button {
            padding: 0.6rem 1.2rem;
            cursor: pointer;
            background-color: #E67E22;
            border: none;
            border-radius: 4px;
            color: #ffffff;
            font-size: 1rem;
            transition: background-color 0.3s ease;
          }
          .reset-button:hover {
            background-color: #d36d14;
          }

          /* Lighter color for White squares, darker color for Black squares */
          .light-square {
            background-color: #FAFAFA;
          }
          .dark-square {
            background-color: #455A64;
          }

          /* Toastify overrides */
          .Toastify__toast--error {
            background: #e74c3c;
          }
          .Toastify__toast--success {
            background: #2ecc71;
          }
        `}
      </style>

      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="chess-game-container">
        {/* Title */}
        <div className="title">Chess Arcade</div>

        <div className="main-layout">
          {/* LEFT COLUMN: Chessboard */}
          <div className="left-column">
            <div className="board-container">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                boardWidth={boardWidth}
                onSquareClick={onSquareClick}
                onSquareMouseEnter={onSquareMouseEnter}
                onSquareMouseLeave={onSquareMouseLeave}
                customSquareStyles={computedSquareStyles}
                boardOrientation={game.turn() === "w" ? "white" : "black"}
                // Light/dark square color overrides
                customLightSquareStyle={{
                  backgroundColor: "#FAFAFA",
                  transition: "background-color 0.3s, transform 0.3s",
                }}
                customDarkSquareStyle={{
                  backgroundColor: "#455A64",
                  transition: "background-color 0.3s, transform 0.3s",
                }}
                // Use custom piece set
                customPieces={buildCustomPieces()}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Timers + Move List */}
          <div className="right-column">
            {/* Timers Row */}
            <div className="timers-row">
              {/* White Timer: spin if whiteActive, else full */}
              <FancyTimer
                time={whiteTime}
                label="White"
                gameOver={gameOver}
                isActive={whiteActive}
                color="#ecf0f1"
              />
              {/* Black Timer: spin if blackActive, else full; new color for black */}
              <FancyTimer
                time={blackTime}
                label="Black"
                gameOver={gameOver}
                isActive={blackActive}
                color="#e74c3c" 
              />
            </div>

            <div className="move-list-container">
              <h3>Move List</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>White</th>
                    <th>Black</th>
                  </tr>
                </thead>
                <tbody>
                  {formatMoveHistory(moveList).map((row) => (
                    <tr key={row.moveNumber}>
                      <td>{row.moveNumber}.</td>
                      <td>{row.white}</td>
                      <td>{row.black}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Status & Reset */}
        <div className="status-container">
          <div className="status-text">{status}</div>
          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>
    </>
  );
}
