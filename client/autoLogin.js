import { loadUserInfo } from './loginHandler.js';

// On page load, check if a passphrase is already stored
window.addEventListener('DOMContentLoaded', (event) => {
  const storedPassphrase = localStorage.getItem('passphrase');
  if (storedPassphrase) {
      // Use the existing loginHandler's logic to load user info
      loadUserInfo(storedPassphrase);
  }
});
