const loadAbilities = (passphrase) => {
    fetch(`http://localhost:3000/abilities/${passphrase}`)
        .then(response => response.json())
        .then(abilities => {
            // Checking and loading ability actions
            loadAbilityActions(abilities, passphrase);
        });
};
