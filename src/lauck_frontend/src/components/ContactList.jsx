import React, { useState } from 'react';

const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const contacts = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Elliot Alderson',
    'Fiona Glenanne',
    'Gordon Freeman',
    'Hannah Baker',
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contact-list-container">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Scrollable Contact List */}
      <ul className="contact-list">
        {filteredContacts.map((contact, index) => (
          <li key={index} className="contact-item">
            {contact}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
