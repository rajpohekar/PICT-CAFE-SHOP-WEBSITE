
document.querySelector('.btn-success').addEventListener('click', () => {
    $('#paymentModal').modal('show');
});
const menuItems = [
    { id: 1, name: 'Veggie Burger', price: 249 },
    { id: 2, name: 'Cheesy Pizza', price: 299 },
    { id: 3, name: 'French Fries', price: 139 },
    { id: 4, name: 'Veg Sandwich', price: 199 },
    { id: 5, name: 'Samosa', price: 69 },
    { id: 6, name: 'Choco Lava Cake', price: 99 }
];

let cart = []; // Array to hold items in the cart

function showNotification(message) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.style.display = 'block'; // Show notification

    // Hide notification after 3 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}
function addToCart(itemId) {
    const cartItem = menuItems.find(item => item.id === itemId);
    if (cartItem) {
        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if item already exists
        } else {
            // Add new item to cart with quantity 1
            cart.push({ ...cartItem, quantity: 1 });
        }
        showNotification(`${cartItem.name} has been added to the cart!`);
    }
    renderCart(); // Update the cart display
}

function removeFromCart(index) {
    cart.splice(index, 1); // Removes the item based on its index
    renderCart(); // Refresh the cart display
}

function renderCart() {
    const cartElement = document.getElementById('cart');
    const totalElement = document.getElementById('total');
    cartElement.innerHTML = ''; // Clear previous cart items
    let total = 0; // Reset total

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('list-group-item');
        itemElement.innerHTML = `${item.name} - ₹${item.price} x ${item.quantity} 
       <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">Remove</button>`;
        cartElement.appendChild(itemElement);

        total += item.price * item.quantity; // Calculate total price
    });

    totalElement.textContent = total.toFixed(2); // Update total display
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const itemId = parseInt(this.getAttribute('data-id'));
        addToCart(itemId); // Add item to cart when button is clicked
    });
});

document.getElementById('orderNow').addEventListener('click', () => {
    if (cart.length > 0) {
        // Save the cart to local storage before redirecting
        localStorage.setItem('cart', JSON.stringify(cart));

        // Retrieve the customer name (you should get this from a form or prompt)
        const customerName = prompt("Please enter your name:");

        // Prepare order data
        const orderData = {
            name: customerName,
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Post Order Data to Server
        fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'order-confirmation.html'; // Redirect if required
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to place order!');
            });
    } else {
        alert('Please Add An Item To Place Order');
    }
});

