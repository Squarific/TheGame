const loadAbilityActions = (abilities, passphrase) => {
    if (abilities.map(a => a.name).includes('CollectLove')) {
        const collectLoveButton = document.createElement('button');
        collectLoveButton.textContent = 'Collect love';
        collectLoveButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/collectLove/${passphrase}`, { method: 'POST' });
        
            // New Code to create heart animation on click
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
            document.body.appendChild(heart);
        
            setTimeout(() => {
                document.body.removeChild(heart);
            }, 5000);
        });
        document.body.appendChild(collectLoveButton);
    }
};
