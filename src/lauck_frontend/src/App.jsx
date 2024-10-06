import React from 'react';
import logo from './assets/logo.png';  // Ensure correct path
import ContactList from './components/ContactList';
import RecordButton from './components/RecordButton';
import './styles/index.scss';  // Import your SCSS

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Site Logo" className="site-logo" />  {/* Logo above the search bar */}
      </header>
      <main className="app-main">
        <ContactList />
        <RecordButton />
      </main>
    </div>
  );
}

export default App;
