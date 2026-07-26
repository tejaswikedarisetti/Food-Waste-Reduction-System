// Admin Login Function
function adminLogin() {
    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "admin");
        window.location.href = "dashboard.html";
        return false;
    } else {
        document.getElementById("error-message").innerText = "Invalid Credentials!";
        return false;
    }
}

// User Login Function
function userLogin() {
    let username = document.getElementById("userUsername").value;
    let password = document.getElementById("userPassword").value;

    if (username === "user" && password === "user123") {
        localStorage.setItem("isLoggedIn", "user");
        window.location.href = "dashboard.html";
        return false;
    } else {
        document.getElementById("error-message").innerText = "Invalid Credentials!";
        return false;
    }
}

// Check if user is logged in
function checkLogin() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        alert("Please log in first!");
        window.location.href = "index.html";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}
// User Login Function
function userLogin() {
    let username = document.getElementById("userUsername").value;
    let password = document.getElementById("userPassword").value;

    if (username === "user" && password === "user123") {  // Default credentials
        localStorage.setItem("isLoggedIn", "user");  // Save login status
        window.location.href = "user-dashboard.html";  // Redirect to dashboard
        return false;  // Prevent form submission
    } else {
        document.getElementById("error-message").innerText = "Invalid Username or Password!";
        return false;  // Prevent form submission
    }
}

// Check if User is Logged In (For User Dashboard)
function checkUserLogin() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "user") {
        alert("Unauthorized Access! Please login first.");
        window.location.href = "index.html";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("isLoggedIn");  // Remove login status
    window.location.href = "index.html";  // Redirect to login page
}
// Admin & User Login
function checkAdminLogin() {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
        alert("Unauthorized Access!");
        window.location.href = "admin-login.html";
    }
}

function checkUserLogin() {
    if (localStorage.getItem("userLoggedIn") !== "true") {
        alert("Unauthorized Access!");
        window.location.href = "user-login.html";
    }
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("userLoggedIn");
    window.location.href = "index.html";
}

// Store Donations
function donateFood() {
    let foodItem = document.getElementById("foodItem").value;
    let quantity = document.getElementById("quantity").value;
    let location = document.getElementById("location").value;

    if (foodItem && quantity && location) {
        let donation = { foodItem, quantity, location };
        let donations = JSON.parse(localStorage.getItem("donations")) || [];
        donations.push(donation);
        localStorage.setItem("donations", JSON.stringify(donations));
        alert("Food Donation Successful!");
        location.reload();
    }
}

// Store Orders
function placeOrder() {
    let orderItem = document.getElementById("orderItem").value;
    let orderLocation = document.getElementById("orderLocation").value;

    if (orderItem && orderLocation) {
        let order = { orderItem, orderLocation };
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        alert("Food Order Placed!");
        location.reload();
    }
}

// Load Data in Admin Panel
window.onload = function() {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let donationTable = document.getElementById("donationList");
    let orderTable = document.getElementById("orderList");

    donations.forEach((donation, index) => {
        let row = donationTable.insertRow();
        row.innerHTML = `<td>${donation.foodItem}</td><td>${donation.quantity} kg</td><td>${donation.location}</td><td><button onclick="removeDonation(${index})">Remove</button></td>`;
    });

    orders.forEach((order, index) => {
        let row = orderTable.insertRow();
        row.innerHTML = `<td>${index + 1}</td><td>${order.orderItem}</td><td>${order.orderLocation}</td><td>Pending</td>`;
    });

    initMap();
};

// Remove Donation
function removeDonation(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    donations.splice(index, 1);
    localStorage.setItem("donations", JSON.stringify(donations));
    location.reload();
}

// Google Maps API
function initMap() {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5
    });

    donations.forEach(donation => {
        let marker = new google.maps.Marker({
            position: { lat: 20.5937, lng: 78.9629 },
            map: map,
            title: donation.foodItem
        });
    });
}
// Initialize Map
let map;
let service;
let userMarker;

function initMap() {
    // Default location (India)
    let defaultLocation = { lat: 20.5937, lng: 78.9629 };

    // Create map
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 5
    });

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Center map on user's location
                map.setCenter(userLocation);
                map.setZoom(12);

                // Mark user location
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });

                // Find nearby food banks
                findFoodBanks(userLocation);
            },
            () => {
                alert("Geolocation failed. Showing default location.");
            }
        );
    } else {
        alert("Geolocation not supported.");
    }
}

// Find Nearest Food Banks
function findFoodBanks(location) {
    let request = {
        location: location || map.getCenter(),
        radius: 10000, // Search within 10 km
        keyword: "food bank"
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
            });
        } else {
            alert("No food banks found nearby.");
        }
    });
}
// Load Food Donations for Recipients
function loadFoodDonations() {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let foodList = document.getElementById("foodList");
    foodList.innerHTML = "";

    donations.forEach((donation, index) => {
        let row = `<tr>
            <td>${donation.foodItem}</td>
            <td>${donation.quantity}</td>
            <td>${donation.donor}</td>
            <td><button onclick="requestFood(${index})">Request</button></td>
        </tr>`;
        foodList.innerHTML += row;
    });
}

// Request Food Order
function requestFood(index) {
    let donations = JSON.parse(localStorage.getItem("donations")) || [];
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let requestedItem = donations[index];
    
    orders.push({
        foodItem: requestedItem.foodItem,
        quantity: requestedItem.quantity,
        status: "Pending"
    });

    // Remove item from donations after ordering
    donations.splice(index, 1);

    localStorage.setItem("donations", JSON.stringify(donations));
    localStorage.setItem("orders", JSON.stringify(orders));

    loadFoodDonations();
    loadOrders();
}

// Load User Orders
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    orders.forEach((order) => {
        let row = `<tr>
            <td>${order.foodItem}</td>
            <td>${order.quantity}</td>
            <td>${order.status}</td>
        </tr>`;
        orderList.innerHTML += row;
    });
}

// Load Data on Page Load
window.onload = function () {
    loadFoodDonations();
    loadOrders();
};
// Load Orders for Admin
function loadOrdersForAdmin() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    orders.forEach((order, index) => {
        let row = `<tr>
            <td>${order.foodItem}</td>
            <td>${order.quantity}</td>
            <td>${order.status}</td>
            <td>
                ${order.status === "Pending" ? `
                    <button onclick="acceptOrder(${index})">Accept</button>
                    <button onclick="rejectOrder(${index})" class="reject">Reject</button>
                ` : order.status}
            </td>
        </tr>`;
        orderList.innerHTML += row;
    });
}

// Accept Order
function acceptOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders[index].status = "Accepted ✅";
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrdersForAdmin();
}

// Reject Order
function rejectOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders[index].status = "Rejected ❌";
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrdersForAdmin();
}

// Load Orders on Page Load
window.onload = function () {
    loadOrdersForAdmin();
};
// Login Function
function login(event) {
    event.preventDefault(); // Prevent form submission

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Sample credentials
    let adminUser = { username: "admin", password: "admin123", role: "admin" };
    let normalUser = { username: "user", password: "user123", role: "user" };
    let recipientUser = { username: "recipient", password: "recipient123", role: "recipient" };

    if (username === adminUser.username && password === adminUser.password) {
        localStorage.setItem("role", "admin");
        window.location.href = "admin.html"; // Redirect to Admin Dashboard
    } 
    else if (username === normalUser.username && password === normalUser.password) {
        localStorage.setItem("role", "user");
        window.location.href = "dashboard.html"; // Redirect to User Dashboard
    } 
    else if (username === recipientUser.username && password === recipientUser.password) {
        localStorage.setItem("role", "recipient");
        window.location.href = "recipient_dashboard.html"; // Redirect to Recipient Dashboard
    }
    else {
        document.getElementById("error-message").innerText = "Invalid Username or Password!";
    }
}
function loadDonations() {
    const donationList = JSON.parse(localStorage.getItem("donations")) || [];
    const tbody = document.getElementById("donationList");

    tbody.innerHTML = "";
    donationList.forEach(donation => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${donation.donorName}</td>
            <td>${donation.foodItem}</td>
            <td>${donation.foodQuantity}</td>
            <td>${donation.donorContact}</td>
            <td>${donation.pickupAddress}</td>
        `;
        tbody.appendChild(row);
    });
}

function loadOrders() {
    const orderList = JSON.parse(localStorage.getItem("orders")) || [];
    const tbody = document.getElementById("orderList");

    tbody.innerHTML = "";
    orderList.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.foodItem}</td>
            <td>${order.quantity}</td>
            <td>${order.location}</td>
            <td>${order.username || 'User'}</td>
        `;
        tbody.appendChild(row);
    });
}
function loadDonations() {
    const donationList = JSON.parse(localStorage.getItem("donations")) || [];
    const tbody = document.getElementById("donationList");

    tbody.innerHTML = "";
    donationList.forEach(donation => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${donation.donorName}</td>
            <td>${donation.foodItem}</td>
            <td>${donation.foodQuantity}</td>
            <td>${donation.donorContact}</td>
            <td>${donation.pickupAddress}</td>
        `;
        tbody.appendChild(row);
    });
}
