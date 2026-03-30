function Results({ guessHistory, onBack }) {
  
  return (
    <div className='result-guess'>
      <h2>Your Guess</h2>
      {
      guessHistory.map((guess, i) => {
        
        return <div key={i} className="guess-row">
          {guess.map((color, j) => {
            return <span key={j} className="guess-block" style={{backgroundColor: color}} />
          })}
        </div>
      })}
      <button className="back-btn" onClick={onBack}>Back to Puzzle</button>
    </div>
  );
}

export default Results;