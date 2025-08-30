// Cart Functionality
let cart = [];
let cartTotal = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Cart Elements
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutPopup = document.getElementById('checkoutPopup');
    const closeCheckoutPopup = document.getElementById('closeCheckoutPopup');
    const checkoutForm = document.getElementById('checkoutForm');
    const cartOverlay = document.getElementById('cartOverlay');

    // Add to Cart Buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-item'),
                price: parseInt(this.getAttribute('data-price')),
                quantity: 1
            };
            
            addToCart(item);
            updateCartUI();
            showCartNotification('Item added to cart!');
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    });

    // Cart Toggle
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
            updateCartUI();
        });
    }

    // Close Cart
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    // Close cart when clicking overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
    }

    // Checkout Button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            checkoutPopup.classList.add('active');
            cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    // Close Checkout Popup
    if (closeCheckoutPopup) {
        closeCheckoutPopup.addEventListener('click', () => {
            checkoutPopup.classList.remove('active');
        });
    }

    // Checkout Form Submit
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.elements['customerName'].value,
                phone: this.elements['customerPhone'].value,
                email: this.elements['customerEmail'].value,
                address: this.elements['customerAddress'].value
            };

            if (!validateCheckoutForm(formData)) {
                return;
            }

            // Prepare order details
            const orderDetails = cart.map(item => 
                `${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`
            ).join('\\n');

            const whatsappMessage = `🛍️ *New Order*\\n\\n` +
                `*Customer Details*\\n` +
                `Name: ${formData.name}\\n` +
                `Phone: ${formData.phone}\\n` +
                `Email: ${formData.email}\\n` +
                `Address: ${formData.address}\\n\\n` +
                `*Order Details*\\n${orderDetails}\\n\\n` +
                `*Total Amount: Rs.${cartTotal}*`;

            const whatsappNumber = "923334258221";
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Show success message and reset
            alert('Thank you for your order! We are redirecting you to WhatsApp to confirm your order.');
            checkoutPopup.classList.remove('active');
            cart = [];
            cartTotal = 0;
            updateCartUI();
            this.reset();
        });
    }

    // Cart Item Management Functions
    function addToCart(newItem) {
        const existingItem = cart.find(item => item.id === newItem.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(newItem);
        }
        updateCartTotal();
    }

    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartTotal();
        updateCartUI();
    }

    function updateQuantity(itemId, newQuantity) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            updateCartTotal();
            updateCartUI();
        }
    }

    function updateCartTotal() {
        cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function updateCartUI() {
        if (!cartItemsContainer || !cartTotalElement) return;

        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalElement.textContent = 'Rs.0';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rs.${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Add event listeners for quantity buttons
            itemElement.querySelector('.minus').addEventListener('click', () => {
                updateQuantity(item.id, item.quantity - 1);
            });

            itemElement.querySelector('.plus').addEventListener('click', () => {
                updateQuantity(item.id, item.quantity + 1);
            });

            itemElement.querySelector('.remove-item').addEventListener('click', () => {
                removeFromCart(item.id);
            });

            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = `Rs.${cartTotal}`;
    }

    function validateCheckoutForm(formData) {
        if (formData.name.length < 3) {
            alert('Please enter a valid name (minimum 3 characters)');
            return false;
        }
        
        if (!/^03\d{9}$/.test(formData.phone)) {
            alert('Please enter a valid phone number (03XXXXXXXXX)');
            return false;
        }
        
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        if (formData.address.length < 10) {
            alert('Please enter a detailed delivery address');
            return false;
        }
        
        return true;
    }

    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }
}); 