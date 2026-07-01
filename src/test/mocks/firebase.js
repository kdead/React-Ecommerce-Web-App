// Mock firebase.js so tests never try to connect to a real Firebase project
export const auth = {
  currentUser: null,
};

export const db = {};
