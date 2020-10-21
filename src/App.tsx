import React, { useState } from 'react';
import Header from './components/Header';
import Countries from './components/Countries';
import countries from './data/countries.json';

import './App.css';

const App = () => {
  const [data] = useState(countries);
  return (
    <div className="App">
      <Header title="React Table & Pagination" />
      <div className="container px-2">
        <Countries data={data} startFrom={1} />
        <Countries data={data} startFrom={5} itemsPerPage={25} />
      </div>
    </div>
  );
};

export default App;
