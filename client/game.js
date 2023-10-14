document.getElementById('loginButton').addEventListener('click', (event)=>{
    event.preventDefault();
    const passphrase = document.getElementById('passphrase').value;
    fetch(`http://localhost:3000/login/${passphrase}`)
    .then(response => {
        if(response.status !== 200) {
            throw new Error('Error logging in');
        }
        return response.json();
    })
    .then(userData => {
        document.getElementById('loginForm').style.display = 'none';
        const greeting = document.getElementById('greeting');
        greeting.textContent = `Hello, ${userData.name}!`;
        greeting.style.display = 'block';

        fetch(`http://localhost:3000/abilities/${passphrase}`)
        .then(response => response.json())
        .then(abilities => {
            if (abilities.map(a => a.name).includes('CollectLove')) {
                const collectLoveButton = document.createElement('button');
                collectLoveButton.textContent = 'Collect love';
                collectLoveButton.addEventListener('click', () => {
                    fetch(`http://localhost:3000/collectLove/${passphrase}`, { method: 'POST' });
                });
                document.body.appendChild(collectLoveButton);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

