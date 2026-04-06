import { useNavigate } from 'react-router-dom';

function GameOver({ onRestart, showResults}) {

  const navigate = useNavigate();

  return (
    <div className='results'>
      <button className='btn' onClick={showResults}>View Results</button>
      <button className='btn' onClick={onRestart}>Play Again</button>
      <button className='btn' onClick={() => navigate('/connectionGame/leaderboard')}>Leaderboard</button>
    </div>
  );
}

export default GameOver;