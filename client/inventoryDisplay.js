export const loadInventory = (passphrase) => {
    fetch(`http://localhost:3000/inventory/${passphrase}`)
        .then(response => response.json())
        .then(inventoryItems => {
            const inventoryContainer = document.getElementById('inventory-container');
            inventoryContainer.style.display = 'block'; // Show the inventory container
            const inventoryList = document.createElement('ul');
            inventoryItems.forEach(item => {
                // Translate inventory item to the corresponding emoji
                const emoji = itemToEmoji(item.item);
                const listItem = document.createElement('li');
                listItem.textContent = `${emoji} ${item.quantity} x ${item.item}`;
                inventoryList.appendChild(listItem);
            });
            // Clear previous inventory list (if any) and append the new list
            inventoryContainer.innerHTML = '<h2>Your Inventory:</h2>';
            inventoryContainer.appendChild(inventoryList);
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });
};

// Helper function to convert item names to emoji
// Add additional cases for different items with their corresponding emojis
const itemToEmoji = (itemName) => {
    switch (itemName.toLowerCase()) {
        case 'heart':
            return '❤️';
        // Add more cases here for each inventory item type
        default:
            return '🔖'; // Default emoji for an item
    }
};
