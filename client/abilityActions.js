export const loadAbilityActions = (abilities, passphrase) => {
    if (abilities.map(a => a.name).includes('CollectLove')) {
        const collectLoveButton = document.createElement('button');
        collectLoveButton.className = 'collect-love-button'; // Added class for styling
        collectLoveButton.textContent = 'Collect love';
        collectLoveButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/collectLove/${passphrase}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                // The server should respond with how many hearts were collected
                const heartsCollected = parseInt(data.heartsCollected, 10);
                // We do a loop to create the desired amount of hearts
                for (let i = 0; i < heartsCollected; i++) {
                    // Create and animate heart
                    const heart = document.createElement('div');
                    heart.className = 'heart';
                    heart.style.left = `${Math.random() * 100}vw`;
                    heart.style.top = `-10%`;
                    document.body.appendChild(heart);
            
                    heart.addEventListener('animationend', () => {
                        document.body.removeChild(heart);
                    });
                }
                console.log(`${heartsCollected} hearts collected!`);
            })
            .catch(error => {
                console.error('Error while collecting love:', error);
            });
        });

        document.body.appendChild(collectLoveButton);
    }
};
