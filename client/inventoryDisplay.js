const loadInventory = (passphrase) => {
    fetch(`http://localhost:3000/inventory/${passphrase}`)
        .then(response => response.json())
        .then(inventoryItems => {
            const inventoryList = document.createElement('ul');
            inventoryList.id = 'inventory-list';

            inventoryItems.forEach(item => {
                const inventoryItem = document.createElement('li');
                inventoryItem.textContent = `${item.item}: ${item.quantity}`;
                inventoryList.appendChild(inventoryItem);
            });

            const inventoryContainer = document.getElementById('inventory-container');
            // Remove the previous inventory list if it exists
            const previousInventoryList = document.getElementById('inventory-list');
            if (previousInventoryList) {
                inventoryContainer.removeChild(previousInventoryList);
            }
            // Append the new inventory list to the container
            inventoryContainer.appendChild(inventoryList);
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });
};

// Export the function for use in other scripts
export { loadInventory };
