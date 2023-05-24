let messages = new Map();
//key is [user1, user2] where user1 is the chat owner and user2 its his contact
//value is the array of messages they sent top each other
// message is in format: content, hour, who

export function addMessage(owner, contact, content, hour, who) {
  let k = [owner, contact];
  let key = JSON.stringify(k);

  if (messages.has(key)) {
    messages.get(key).push({ content, hour, who });
  } else {
    messages.set(key, [{ content, hour, who }]);
  }
}

export function getMessages(owner, contact) {
  let k = [owner, contact];
  let key = JSON.stringify(k);
  if (messages.has(key)) {
    return messages.get(key);
  } else {
    return [];
  }
}


export default messages;