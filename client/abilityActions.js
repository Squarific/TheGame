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
            // You can adjust the offset if needed, to place the heart above the viewport top edge
            heart.style.top = `-10%`; 
            document.body.appendChild(heart);
        
            // Use the 'animationend' event to remove the heart after animation is complete
            heart.addEventListener('animationend', () => {
                document.body.removeChild(heart);
            });
        });
        document.body.appendChild(collectLoveButton);
    }
};
