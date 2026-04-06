import { useState, useEffect, useRef } from 'react';
import ActionsBar from './ActionsBar.jsx';
import CardGrid from './CardGrid.jsx';
import GameOver from './GameOver.jsx';
import Results from './Results.jsx';
import './Game.css';

function buildArray(data) {
  return data.flatMap((group, groupIndex) => group.members.map((member, memberIndex) => 
                            ({id: groupIndex * group.members.length + memberIndex + ":" + member, value: member, category: group.title, color: group.color})));
}

function shuffleItems(array) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function constructGroup(data, order) {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  
  return shuffle(data).slice(0, order).map(group => ({"title": group.title, 
                                      "members": shuffle(group.members).slice(0, order), 
                                      "color": group.color}));
}

async function getData() {
  const requestOptions = {method: 'GET', headers: {'Content-Type': 'application/json',}};
  
  const response = await fetch("/connectionGame/getResponse.action", requestOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }

  const resp = await response.json();
  const categories = JSON.parse(resp.llmResponse);
  return categories;
}

export default function Game({ currentUser, onScoreChange }) {

  const [order, setOrder] = useState(4);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [correctGroups, setCorrectGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [lives, setLives] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [oneAway, setOneAway] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const guessHistoryRef = useRef([]);

  async function loadData() {
    setLoading(true);
    const category = await getData();
    if (category) {
      setCategories(category);
      const constructed = constructGroup(category, order);
      setGroups(constructed);
      setItems(() => shuffleItems(buildArray(constructed)));
    }
    setLoading(false);
  }

  useEffect(() => { loadData() },[]);

  useEffect(() => {
    if (!oneAway) return ;
    const timer = setTimeout(() => setOneAway(false), 3000);

    return () => clearTimeout(timer);
  }, [oneAway]);

  useEffect(() => {
    if (gameOver) updateScore();
  }, [gameOver]);

  console.log("Categories : ", categories);
  console.log("Groups : ", groups);
  console.log("Items : ", items);
 
  function handleShuffle() {
    setItems(prev => shuffleItems(prev));
  }

  function handleDeselectAll() {
    setSelectedItems([]);
  }

  function handleOrderChange(e) {
    const newOrder = Number(e.target.value);
    const constructed = constructGroup(categories, newOrder);
    setSelectedItems([]);
    setCorrectGroups([]);
    setGroups(constructed);
    setItems(shuffleItems(buildArray(constructed)));
    setLives(newOrder);
    setOrder(newOrder);
    setGameOver(false);
    setShowResults(false);
    guessHistoryRef.current = [];
  }

  function handleSubmit() {
    let count = {};
    for (let i of selectedItems) {
      count[i.category] = (i.category in count)? count[i.category] + 1 : 1;
    }
    
    let maxCount = Math.max(...Object.values(count));
    //console.log(maxCount);
    guessHistoryRef.current.push(selectedItems.map(s => s.color));
    
    if (maxCount === order) {
      const newCorrectGroups = [...correctGroups, groups.find(g => g.title === selectedItems[0].category)];
      setCorrectGroups(newCorrectGroups);

      setItems(prev => prev.filter(i => i.category !== selectedItems[0].category));

      setSelectedItems([]);
      /*if (groups.length - newCorrectGroups.length === 1) {
        const remGroup = groups.find(g => !newCorrectGroups.some(c => c.title === g.title));

        setTimeout(() => {
          setCorrectGroups([...newCorrectGroups, remGroup]);
          setItems([]);
          setGameOver(true);
        }, 500); 
        setGameOver(true);
      }*/  
     if (correctGroups.length === (order - 1)) setGameOver(true);

    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setOneAway(maxCount === order - 1 && order != 2);
      handleDeselectAll();

      if (newLives === 0) {
        const unsolvedGroups = groups.filter(g => !correctGroups.some(c => c.title === g.title));
        
        unsolvedGroups.forEach((group, i) => { setTimeout(() => {
            setCorrectGroups(prev => [...prev, group]);
            setItems(prev => prev.filter(g => g.category !== group.title));
          }, 500 + i * 200);
        })
        setGameOver(true);
      }
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
    const newGroups = constructGroup(categories, 4);
    setGroups(newGroups);
    setItems(shuffleItems(buildArray(newGroups)));
    setSelectedItems([]);
    setCorrectGroups([]);
    setLives(4);
    setGameOver(false);
    setShowResults(false);
    setOrder(4);
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
      const returnedUsername = resp.username;
      const updatedScore = resp.score;

      onScoreChange(newScore);

      //console.log("After updating score : ", returnedUsername, updatedScore);
    } catch(err) {
      console.log("Error : ", err);
    }
  }

  console.log("score : ", currentUser.score);

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
