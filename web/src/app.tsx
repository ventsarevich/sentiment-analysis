import React, { ReactElement } from 'react';

import './app.css';

function App(): ReactElement {
  return (
    <div className="app">
      <header className="app-header">
        <p>
          Edit
          <code>src/App.tsx</code>
          {' '}
          and save to reload.wewwefwef
        </p>
        <a
          className="app-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
