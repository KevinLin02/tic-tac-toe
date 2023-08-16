import logo from './logo.svg';
import './App.css';

import { useState } from 'react';
import pika from './pikachu.svg';
import char from './charmander.svg';


function Square({ value, onSquareClick, xIsNext }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleMouseEnter = () => {
    if (!value) {
      setIsHovered(true);
      setHoveredImage(xIsNext ? pika : char);
    }
  };

  const handleMouseLeave = () => {
      setIsHovered(false);
      setHoveredImage(null);
  };

  return (
    <button 
    className={`square ${value === 'pika' ? 'pika-bg' : value === 'char' ? 'char-bg' : ''}`} 
      onClick={onSquareClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      
      >
      {isHovered && hoveredImage && (
        <img 
          src={hoveredImage} 
          alt={xIsNext ? "pikachu" : "charmander"}
          className="hovered-image"
        />
      )}

      {value === 'pika' ? (
        <img src={pika} alt="pikachu" className="squareImage " />
      ) : value === 'char' ? (
        <img src={char} alt="charmander" className="squareImage "/>
      ) : (
        value
      )}
      
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'pika';
    } else {
      nextSquares[i] = 'char';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <>
        {Array.from(Array(9).keys()).map(index => (
          <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} xIsNext={xIsNext} />
        ))}
      </>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info" >
        <ol>{moves}</ol>
      </div>

    </div>
    <div>
      {winner && (
      <div className={`result ${winner === 'pika' ? 'pika-bg' : winner === 'char' ? 'char-bg' : ''}`} style={{display:'flex'}}>
        The winner is ：
        <img
          src={winner === 'pika' ? pika : char}
          alt={winner === 'pika' ? "pikachu" : "charmander"}
          className="winenrImage"
          style={{width:"80px", height:"60px" }}
        />
      </div>
      )}
    </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
    return null;
}

