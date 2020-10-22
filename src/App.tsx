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
        <Countries
          data={data}
          startFrom={1}
          searchByData={[
            { label: 'Search by country', value: 'name' },
            { label: 'Search by capital', value: 'capital' },
            { label: 'Search by country code', value: 'iso2' },
            { label: 'Search by currency', value: 'currency' },
            { label: 'Search by phone code', value: 'phone_code' },
          ]}
        />
        <Countries data={data} startFrom={5} itemsPerPage={25} />
      </div>
    </div>
  );
};

export default App;
