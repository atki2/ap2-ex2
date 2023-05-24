const contacts = new Map();

export function addContact(username, contactUsername, displayName, image, date, hour) {
  if (!contacts.has(username)) {
    contacts.set(username, []);
  }
  const contactsList = contacts.get(username);
  const existingContact = contactsList.find((contact) => contact.userName === contactUsername);
  if (existingContact) {
    existingContact.displayName = displayName;
    existingContact.image = image;
    existingContact.date = date;
    existingContact.hour = hour;
  } else {
    const contact = { userName: contactUsername, displayName, image, date, hour };
    contactsList.push(contact);
  }
}



export function getContacts(username) {
  const contactsArr = contacts.get(username);
  return contactsArr ? contactsArr : [];
}

export function changeContact(userName, contactToChangeUsername, newContact) {
  const contactsMap = contacts.get(userName);
  if (contactsMap) {
    const contactIndex = contactsMap.findIndex((contact) => contact.userName === contactToChangeUsername);
    if (contactIndex !== -1) {
      contactsMap[contactIndex] = newContact;
      contacts.set(userName, contactsMap);
      return true;
    }
  }
  return false;
}

export function contactExists(username, contactUsername) {
  const contactsArr = contacts.get(username);
  if (contactsArr) {
    return contactsArr.some((contact) => contact.userName === contactUsername);
  }
  return false;
}

export default contacts;
