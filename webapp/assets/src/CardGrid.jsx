import Card from './Card.jsx';
import './CardGrid.css';

function CardGrid({ items, selectedItems, onToggle, order}) {
  
  return (
    <div className="card-grid" style={{gridTemplateColumns: 'repeat(' + order + ', 1fr)'}}>
      {items.map((item) => (
        <Card key={item.id} item = {item} 
              onToggle={onToggle} isSelected = {selectedItems.includes(item)} />
      ))}
    </div>
  );
}

export default CardGrid;