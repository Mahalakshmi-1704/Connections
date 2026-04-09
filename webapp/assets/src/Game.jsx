import { useState, useEffect, useRef } from 'react';
import ActionsBar from './ActionsBar.jsx';
import CardGrid from './CardGrid.jsx';
import GameOver from './GameOver.jsx';
import Results from './Results.jsx';
import './Game.css';

function shuffleItems(array) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

/*function constructGroup(data, order) {

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  
  return shuffle(data).slice(0, order).map(group => ({"title": group.title, 
                                      "members": shuffle(group.members).slice(0, order), 
                                      "color": group.color}));
}*/

async function getData(order) {

  //console.log("Order : ", order);
  const requestOptions = {method: 'POST', headers: {'Content-Type': 'application/json' }, body: JSON.stringify({order: order})};
  
  const response = await fetch("/connectionGame/getResponse.action", requestOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const resp = await response.json();
  
  //console.log("Items fetched in getData : ",resp.items);
  return resp.items;
}

export default function Game({ currentUser, onScoreChange }) {

  const [order, setOrder] = useState(4);
  const [items, setItems] = useState([]);
  const [correctGroups, setCorrectGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lives, setLives] = useState(order);
  const [gameOver, setGameOver] = useState(false);
  const [oneAway, setOneAway] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const guessHistoryRef = useRef([]);

  async function loadData() {
    setLoading(true);
    const items = await getData(order);
    if (items) {
      setItems(shuffleItems(items));
    }
    setLoading(false);
  }

  useEffect(() => { loadData() }, [order]);

  useEffect(() => {
    if (!oneAway) return ;
    const timer = setTimeout(() => setOneAway(false), 3000);

    return () => clearTimeout(timer);
  }, [oneAway]);

  useEffect(() => {
    if (gameOver) updateScore();
  }, [gameOver]);

  //console.log("Items : ", items);
 
  function handleShuffle() {
    setItems(prev => shuffleItems(prev));
  }

  function handleDeselectAll() {
    setSelectedItems([]);
  }

  function handleOrderChange(e) {
    const newOrder = Number(e.target.value);
    setSelectedItems([]);
    setCorrectGroups([]);
    setLives(newOrder);
    setOrder(newOrder);
    setGameOver(false);
    setShowResults(false);
    guessHistoryRef.current = [];
  }

  async function handleSubmit() {
    let correct = false;

    const data = {selectedList: selectedItems.map(i => i.value)};
    //console.log("Selected Items :",data);

    guessHistoryRef.current.push(selectedItems.map(s => s.color));

    try {
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)};
      const response = await fetch("/connectionGame/checkGroup.action", requestOptions);
      if (!response.ok) {
        console.log(response.status);
        return;
      }

      const resp = await response.json();

      //console.log("Correct : ", resp.isCorrect);
      //console.log("oneAway : ", resp.oneAway);

      correct = resp.isCorrect;
      setOneAway(resp.oneAway);

      if (correct) {        
        //console.log("Correct Group");
        //console.log("Title : ",resp.group.title);
        //console.log("Members : ", resp.group.members);

        const newCorrectGroups = [...correctGroups, resp.group];
        selectedItems.forEach(s => setItems(prev => prev.filter(i => i.value !== s.value)));
        setCorrectGroups(newCorrectGroups);
        setSelectedItems([]);
        if (correctGroups.length === (order - 1)) setGameOver(true);

      } else {
        const newLives = lives - 1;
        setLives(newLives);
        handleDeselectAll();

        if (newLives === 0) {
          try {
            const requestOptions = { method: 'GET', headers: {'Content-Type': 'application/json' },};
            const groupResp = await fetch("/connectionGame/revealGroup.action", requestOptions);
            if (!groupResp.ok) {
              console.log(groupResp.status);
              return;
            }

            const res = await groupResp.json();
            let groups = res.groups;
            for (const solved of correctGroups) {
              groups = groups.filter(g => g.title !== solved.title);
            }

            //console.log("Unsolved groups : ", groups);
            groups.forEach((group, i) => { setTimeout(() => {
                setCorrectGroups(prev => [...prev, group]);
                //setItems(prev => prev.filter(g => g.category !== group.title));
                group.members.forEach(member => setItems(prev => prev.filter(g => g.value !== member)));
              }, 500 + i * 200);
            })
            setGameOver(true);
          } catch(e) {
            console.log("Error in fetching unsolved Groups : ", e);
          }
        }
      }

    } catch(err) {
      console.log("Error : ", err);
    }
  }

  function handleToggle(item) {
    if (selectedItems.some(s => s.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      if (selectedItems.length < order)
        setSelectedItems([...selectedItems, item]);
    }
  }

  function handleRestart() {
    loadData();
    setSelectedItems([]);
    setCorrectGroups([]);
    setLives(order);
    setGameOver(false);
    setShowResults(false);
    guessHistoryRef.current = [];
  }

  async function updateScore(){

    const newScore = currentUser.score + correctGroups.length;
    const data = {username: currentUser.username, score: newScore};
    try {
      const requestOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)};
      const response = await fetch("/connectionGame/updateScore.action", requestOptions);
      if (!response.ok) {
        console.log(response.status);
        return;
      }

      const resp = await response.json();
      onScoreChange(newScore);
    } catch(err) {
      console.log("Error : ", err);
    }
  }

  //console.log("score : ", currentUser.score);

  if (loading) return <div>Loading...</div>

  return (
    <div className="game-container">
      <div className="player-info">
        <p><b>{currentUser.username}</b><br />Score : {currentUser.score}</p>
      </div>

      <h3>Create groups of {order}!</h3>

      <label htmlFor="order">Play : </label>
      <select name="order" id="order" value={order} onChange={handleOrderChange} disabled={gameOver}>
        <option value={2}>2 * 2</option>
        <option value={3}>3 * 3</option>
        <option value={4}>4 * 4</option>
        <option value={5}>5 * 5</option>
        <option value={6}>6 * 6</option>
      </select>

      <br /><br />
      {oneAway && <div className="one-away">
          <p>One Away...</p>
        </div>}

      <div className="game-board">
        {correctGroups.map(group => (
              <div key={group.title} className="solved-group" style={{backgroundColor: group.color}}>
                <span style={{fontWeight: 'bold'}}>{group.title}</span><br />
                <span>{group.members.join(', ')}</span>
              </div>
        ))}

        <CardGrid items={items} selectedItems={selectedItems} onToggle={handleToggle} order={order}/>
      </div>

      <br></br>
      <div className="lives">
        <span>Lives Remaining : </span>
        {Array.from({ length : order }, (_, i) => (
          <span key={i} className={i < lives ? 'dot-fill' : 'dot-nofill'} />
        ))}
      </div>

      {!gameOver && <ActionsBar onSubmit={handleSubmit} onDeselect={handleDeselectAll} onShuffle={handleShuffle} 
                submitDisabled={selectedItems.length != order}
                deselectDisabled={selectedItems.length === 0} /> }

      {gameOver && <GameOver onRestart={handleRestart} showResults={() => setShowResults(true)} />}

      {showResults && <Results guessHistory = {guessHistoryRef.current} onBack={() => setShowResults(false)}/>}
    </div>
  );
}

