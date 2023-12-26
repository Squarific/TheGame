import { loadInventory } from './inventoryDisplay.js';
import { loadAbilities } from './abilityLoader.js'; // Correctly imports the now exported function

// The function to load user info, now exportable
export const loadUserInfo = (passphrase) => {
    fetch(`http://localhost:3000/login/${passphrase}`)
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Error logging in');
        }
        return response.json();
    })
    .then(userData => {
        localStorage.setItem('passphrase', passphrase); // Store passphrase in localStorage
        document.getElementById('loginForm').style.display = 'none';
        const greeting = document.getElementById('greeting');
        greeting.textContent = `Hello, ${userData.name}!`;
        greeting.style.display = 'block';
        
        // Loading abilities
        loadAbilities(passphrase);
        // Loading inventory
        loadInventory(passphrase);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault();
    const passphrase = document.getElementById('passphrase').value;
    loadUserInfo(passphrase); // Use the new exported function
});
