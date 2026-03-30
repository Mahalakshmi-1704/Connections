function GameOver({ onRestart, showResults}) {

  return (
    <div className='results'>
      <button className='btn' onClick={showResults}>View Results</button>
      <button className='btn' onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default GameOver;