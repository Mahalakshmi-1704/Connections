function ActionsBar({ onSubmit, onDeselect, onShuffle, submitDisabled, deselectDisabled }) {

  return (
    <div className='actions'>
      <button className='btn' onClick = {onShuffle}>Shuffle</button>
      <button className='btn' onClick = {onDeselect} disabled={deselectDisabled}>Deselect All</button>
      <button className='btn' onClick = {onSubmit} disabled={submitDisabled}>Submit</button>
    </div>
  );
}

export default ActionsBar;