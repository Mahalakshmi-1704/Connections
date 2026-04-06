import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login.jsx';
import Game from './Game.jsx';
import Leaderboard from './Leaderboard.jsx';

export default function App() {

    const [user, setUser] = useState(null); //{username: , score: }
    //const navigate = useNavigate();

    function handleScoreChange(newScore) {
        setUser(prev => ({...prev, score: newScore}));
    }
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/connectionGame" element={<Login onLogin={ setUser }/>} />
                <Route path="/connectionGame/game" element={ user ? <Game currentUser = {user} onScoreChange={handleScoreChange} />
                                                : <Navigate to="/connectionGame" replace={true} />} />
                <Route path="/connectionGame/leaderboard" element={<Leaderboard currentUser={user}/>} />
                <Route path="*" element={<Navigate to="/connectionGame" replace={true} />} />
            </Routes>
        </BrowserRouter>
    );
}
