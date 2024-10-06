import React from 'react';
import ContactList from './components/ContactList';
import RecordButton from './components/RecordButton';
import './styles/index.scss';  // Import your SCSS

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lauck - Audio Messenger</h1>
      </header>
      <main className="app-main">
        <ContactList />
        <RecordButton />
      </main>
    </div>
  );
}

export default App;
