import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { BLACK } from 'chess.js';

const MemoryCard = ({ card, onClick, isFlipped }) => (
  <div
    className={`aspect-square m-1 cursor-pointer transition-all duration-300 rounded-xl flex items-center justify-center text-3xl
                 ${isFlipped 
                   ? 'bg-gradient-to-br from-blue-300 to-blue-500 text-white' 
                   : 'bg-gradient-to-br from-gray-200 to-gray-300'
                 } 
                 shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.1),_inset_2px_2px_5px_rgba(255,255,255,0.5)]`}
    onClick={onClick}
    style={{
      boxShadow: isFlipped 
        ? 'inset -2px -2px 5px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.7)' 
        : 'inset -2px -2px 5px rgba(0,0,0,0.1), inset 2px 2px 5px rgba(255,255,255,0.5)'
    }}
  >
    {isFlipped && card.emoji}
  </div>
);

const MemoryGame = () => {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'];
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, [gridSize]);

  const shuffleCards = () => {
    const pairsCount = Math.floor(gridSize * gridSize / 2);
    const selectedEmojis = emojis.slice(0, pairsCount);
    const shuffled = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].emoji)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    setMoves(moves + 1);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedPairs([...matchedPairs, cards[firstIndex].emoji]);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  const handleGridSizeChange = (event) => {
    setGridSize(Number(event.target.value));
  };

  const sliderStyle = {
    width: '100%',
    appearance: 'none',
    height: '15px',
    borderRadius: '5px',
    background: '#d3d3d3',
    outline: 'none',
    opacity: '0.7',
    transition: 'opacity .2s',
  };

  const sliderThumbStyle = {
    appearance: 'none',
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    background: '#4CAF50',
    cursor: 'pointer',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#4Ccc',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Memory Game</h1>
      <div className="mb-4 text-gray-700">
        <span className="mr-4">Moves: {moves}</span>
        <span>Pairs found: {matchedPairs.length}</span>
      </div>
      <div className="mb-4 w-64">
        <label className="block text-sm font-medium text-gray-700 mb-1">Grid Size: {gridSize}x{gridSize}</label>
        <input
          type="range"
          min="3"
          max="12"
          value={gridSize}
          onChange={handleGridSizeChange}
          style={{
            ...sliderStyle,
            '::-webkit-slider-thumb': sliderThumbStyle,
            '::-moz-range-thumb': sliderThumbStyle,
          }}
        />
      </div>
      <div 
        className="grid gap-2 mb-4 w-full max-w-3xl"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {cards.map((card, index) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={() => handleCardClick(index)}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(card.emoji)}
          />
        ))}
      </div>
      <button 
        onClick={shuffleCards} 
        style={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4Ccc'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4ccc'}
      >
        <Shuffle style={{ marginRight: '8px' }} /> Shuffle and Restart
      </button>
    </div>
  );
};

export default MemoryGame;