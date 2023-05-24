
const registers = new Map();


export function addUser(username, password, displayName, picture) {
  registers.set(username, { password, displayName, picture });
}


export function isRegistered(username) {
  return registers.has(username);
}

export function getPassword(username) {
  const user = registers.get(username);
  return user ? user.password : null;
}

export function getProfilePhoto(username) {
  const user = registers.get(username);
  return user ? user.picture : null;
}

export function getDisplayName(username) {
  const user = registers.get(username);
  return user ? user.displayName : null;
}


export default registers;