import React from 'react';

const SummonerForm = ({ handleSubmit, handleChange }) => {
  return (
    <div className='block SummonerForm'>
      <form onSubmit={handleSubmit}>
        <h1> A name to track. </h1>
        <input type='text' onChange={handleChange('summoner')} /><br/>
        <input className='Submit-btn' type='submit' value='search'/>
      </form>
    </div>
  );
}

export default SummonerForm;
