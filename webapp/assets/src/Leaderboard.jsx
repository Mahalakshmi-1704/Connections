import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

export default function Leaderboard({ currentUser }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);
    const navigate = useNavigate();


    async function fetchLeaderboard() {
        try {
            const response = await fetch('/connectionGame/leaderboard.action', {method: 'GET'});
            if (!response.ok) { console.log(response.status); return;}
            const resp = await response.json();

            console.log(resp.leaderboard);

            setLeaderboard(resp.leaderboard);
            setLoading(false);
        } catch (err) {
            setError("Failed to load leaderboard.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    //className={user.username === currentUser ? 'highlight-row' : ''}

    if (loading) return <div className="leaderboard-container">Loading...</div>;

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user.username} className={user.username === currentUser.username ? 'highlight-row' : ''}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="back-btn" onClick={() => navigate('/connectionGame/game')}>Back to Game</button>
        </div>
    );
}