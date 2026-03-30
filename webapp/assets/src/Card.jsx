import './Card.css';

function Card({ item, isSelected, onToggle }) {

  return (
    <>
      <button className = 'card'
        onClick = {() => onToggle(item)}
        style = {{
          backgroundColor: isSelected ? 'black' : '#F0F0F0',
          color: isSelected? '#f0f0f0' : 'black',
        }}>{ item.value }</button>
    </>
  );
}

export default Card;