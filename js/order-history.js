document.addEventListener("DOMContentLoaded", function () {
  const orderListContainer = document.getElementById("orderList");
  const noOrdersMessage = document.getElementById("noOrdersMessage");

  // Constants (re-defined here as order-history.js is a separate script)
  // These are no longer directly used for calculation in history, but for display consistency
  // if you want to show per-gallon price for context.
  const PRICE_PER_GALLON = 25; // Adjusted to match Purified Water price from order.js
  const DELIVERY_FEE = 20;

  // Function to format currency
  function formatCurrency(amount) {
    // Ensure amount is a number before fixing to 2 decimal places
    return `₱${parseFloat(amount).toFixed(2)}`;
  }

  // Function to get current user (assuming auth.js loads first and makes it global)
  function getCurrentUser() {
    // Access window.getCurrentUser to ensure it's from the globally exposed function
    return typeof window.getCurrentUser === "function"
      ? window.getCurrentUser()
      : null;
  }

  // Function to get all orders from localStorage
  function getAllOrders() {
    return JSON.parse(localStorage.getItem("waterStationOrders")) || [];
  }

  // Function to display orders for the logged-in user
  function displayOrderHistory() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      // User not logged in, display a message or redirect to login
      orderListContainer.innerHTML = `
                <p class="no-orders-message">Please <a href="login.html">log in</a> to view your order history.</p>
            `;
      // Hide the default "no orders" message if it exists
      if (noOrdersMessage) noOrdersMessage.style.display = "none";
      return;
    }

    const allOrders = getAllOrders();
    // Filter orders by the current user's email
    const userOrders = allOrders.filter(
      (order) => order.customer && order.customer.email === currentUser.email
    );

    if (userOrders.length === 0) {
      if (noOrdersMessage) noOrdersMessage.style.display = "block"; // Show if no orders
      return;
    } else {
      if (noOrdersMessage) noOrdersMessage.style.display = "none"; // Hide if orders exist
    }

    // Sort orders by date, newest first
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orderListContainer.innerHTML = ""; // Clear previous content

    userOrders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");

      // Determine status badge class
      let statusClass = "";
      if (order.status) {
        statusClass = order.status.toLowerCase();
      }

      // Safely access properties from the new 'orderTotal' object
      const paymentMethod =
        order.orderTotal && order.orderTotal.paymentMethod
          ? order.orderTotal.paymentMethod
          : "N/A";
      const totalAmount =
        order.orderTotal && typeof order.orderTotal.total === "number"
          ? formatCurrency(order.orderTotal.total)
          : "N/A";
      const deliveryFee =
        order.orderTotal && typeof order.orderTotal.deliveryFee === "number"
          ? formatCurrency(order.orderTotal.deliveryFee)
          : "N/A";
      const productsSubtotal =
        order.orderTotal &&
        typeof order.orderTotal.productsSubtotal === "number"
          ? formatCurrency(order.orderTotal.productsSubtotal)
          : "N/A";

      let itemsHtml = "";
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          itemsHtml += `
                        <div class="order-item">
                            <span>${item.name}</span>
                            <span>${item.quantity} x ${formatCurrency(
            item.price
          )}</span>
                            <span>${formatCurrency(item.subtotal)}</span>
                        </div>
                    `;
        });
      } else {
        itemsHtml =
          '<div class="order-item"><span>No specific items recorded.</span></div>';
      }

      orderCard.innerHTML = `
                <h2>
                    Order ID: ${order.id || "N/A"}
                    <span class="status-badge ${statusClass}">${
        order.status || "Unknown"
      }</span>
                </h2>
                <div class="order-meta">
                    <p><strong>Date:</strong> ${order.date || "N/A"}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p><strong>Delivery Zone:</strong> ${
                      order.customer && order.customer.zone
                        ? order.customer.zone
                        : "N/A"
                    }</p>
                    <p><strong>Delivery Address:</strong> ${
                      order.customer && order.customer.address
                        ? order.customer.address
                        : "N/A"
                    }</p>
                </div>
                <div class="order-items">
                    <div class="receipt-item-header">
                        <span>Item</span>
                        <span>Qty x Price</span>
                        <span>Total</span>
                    </div>
                    ${itemsHtml}
                </div>
                <div class="order-summary">
                    <p><span>Products Subtotal:</span> <span>${productsSubtotal}</span></p>
                    <p><span>Delivery Fee:</span> <span>${deliveryFee}</span></p>
                    <p class="total"><span>Total Amount:</span> <span>${totalAmount}</span></p>
                </div>
            `;
      orderListContainer.appendChild(orderCard);
    });
  }

  // Call the function to display order history when the page loads
  displayOrderHistory();
});
