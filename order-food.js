// Function to handle placing a food order
function placeOrder(event) {
    event.preventDefault(); // Prevent form submission

    let orderItem = document.getElementById("orderItem").value;
    let orderQuantity = document.getElementById("orderQuantity").value;
    let orderLocation = document.getElementById("orderLocation").value;

    // Create an order object
    let order = { orderItem, orderQuantity, orderLocation, status: "Pending" };

    // Get existing orders from localStorage or initialize an empty array
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Push the new order to the orders array
    orders.push(order);

    // Save the updated orders array back to localStorage
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear the input fields after placing an order
    document.getElementById("orderItem").value = "";
    document.getElementById("orderQuantity").value = "";
    document.getElementById("orderLocation").value = "";

    // Reload the orders table
    loadOrders();
    alert("Order Placed Successfully!");
}

// Function to load the orders from localStorage and display them in the table
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let orderList = document.getElementById("orderList");

    // Clear the table before adding new rows
    orderList.innerHTML = "";

    // Loop through orders and add each one to the table
    orders.forEach(order => {
        let row = `<tr>
            <td>${order.orderItem}</td>
            <td>${order.orderQuantity} kg</td>
            <td>${order.orderLocation}</td>
            <td>${order.status}</td>
        </tr>`;
        orderList.innerHTML += row;
    });
}
