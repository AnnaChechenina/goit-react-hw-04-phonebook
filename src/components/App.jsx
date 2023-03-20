import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Message from './Message';
import css from './App.module.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    parsedContacts ? setContacts(parsedContacts) : setContacts([]);
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = ({ name, number }) => {
    if (contacts.some(contact => contact.name === name)) {
      return Report.warning(`${name} is already in contacts!`);
    }

    const contact = { id: nanoid(), name, number };

    setContacts(prevContacts => [contact, ...prevContacts]);
  };

  const deleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const changeFilter = evt => setFilter(evt.currentTarget.value);

  const filtredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>
        Phone<span className={css.title__color}>book</span>
      </h1>
      <ContactForm onSubmit={addContact} />

      <h2 className={css.subtitle}>Contacts</h2>
      <Filter filter={filter} changeFilter={changeFilter} />
      {contacts.length > 0 ? (
        <ContactList
          contacts={filtredContacts()}
          onDeleteContact={deleteContact}
        />
      ) : (
        <Message text="Contact list is empty." />
      )}
    </div>
  );
}
export default App;
