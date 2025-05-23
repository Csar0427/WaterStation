document.addEventListener("DOMContentLoaded", function () {
  const ordersTableBody = document.getElementById("ordersTableBody");
  const orderDetailsModal = document.getElementById("orderDetailsModal");
  const closeModalBtn = document.querySelector(
    "#orderDetailsModal .close-modal"
  );

  // Function to format currency
  function formatCurrency(amount) {
    return `₱${parseFloat(amount).toFixed(2)}`;
  }

  // NEW FUNCTION: Formats date to "Month Day, Year at Hour:Minute AM/PM"
  function formatOrderDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A"; // Return N/A if dateString is invalid
    }

    const options = {
      year: "numeric",
      month: "long", // "May"
      day: "numeric", // "22"
      hour: "numeric", // "10"
      minute: "2-digit", // "30"
      hour12: true, // "AM/PM"
    };
    return date.toLocaleString("en-US", options);
  }

  // Function to get all orders from localStorage
  function getAllOrders() {
    return JSON.parse(localStorage.getItem("waterStationOrders")) || [];
  }

  // Function to save all orders to localStorage
  function saveAllOrders(orders) {
    localStorage.setItem("waterStationOrders", JSON.stringify(orders));
  }

  // Function to display orders in the admin table
  function displayAdminOrders() {
    const allOrders = getAllOrders();
    ordersTableBody.innerHTML = ""; // Clear existing table rows

    if (allOrders.length === 0) {
      ordersTableBody.innerHTML = `<tr><td colspan="8" class="no-orders-message">No orders found.</td></tr>`;
      return;
    }

    // Sort orders by date, newest first
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    allOrders.forEach((order) => {
      const row = ordersTableBody.insertRow();

      // Determine status badge class
      let statusClass = "";
      if (order.status) {
        statusClass = order.status.toLowerCase().replace(/\s/g, "-");
      }

      // Get total quantity of items (e.g., total gallons)
      const totalItemsQuantity = order.items
        ? order.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

      row.innerHTML = `
                <td>${order.id || "N/A"}</td>
                <td>${order.customer ? order.customer.name : "N/A"}</td>
                <td>${order.customer ? order.customer.address : "N/A"}</td>
                <td>${formatOrderDate(order.date)}</td>
                <td>${totalItemsQuantity}</td>
                <td>${
                  order.orderTotal ? order.orderTotal.paymentMethod : "N/A"
                }</td>
                <td><span class="status-badge ${statusClass}">${
        order.status || "Unknown"
      }</span></td>
                <td>
                    <button class="btn-view-details" data-order-id="${
                      order.id
                    }">View Details</button>
                    <select class="status-dropdown" data-order-id="${order.id}">
                        <option value="Pending" ${
                          order.status === "Pending" ? "selected" : ""
                        }>Pending</option>
                        <option value="Processing" ${
                          order.status === "Processing" ? "selected" : ""
                        }>Processing</option>
                        <option value="Out for Delivery" ${
                          order.status === "Out for Delivery" ? "selected" : ""
                        }>Out for Delivery</option>
                        <option value="Delivered" ${
                          order.status === "Delivered" ? "selected" : ""
                        }>Delivered</option>
                        <option value="Cancelled" ${
                          order.status === "Cancelled" ? "selected" : ""
                        }>Cancelled</option>
                    </select>
                </td>
            `;
    });
  }

  // Function to update order status
  function updateOrderStatus(orderId, newStatus) {
    const allOrders = getAllOrders();
    const orderIndex = allOrders.findIndex((order) => order.id === orderId);

    if (orderIndex > -1) {
      allOrders[orderIndex].status = newStatus;
      saveAllOrders(allOrders);
      displayAdminOrders(); // Re-render the table to show updated status
      // alert(`Order ${orderId} status updated to ${newStatus}`); // Optional: for confirmation
    } else {
      // alert(`Order with ID ${orderId} not found.`); // Optional: for error
    }
  }

  // Event listener for status dropdown changes
  ordersTableBody.addEventListener("change", function (event) {
    if (event.target.classList.contains("status-dropdown")) {
      const orderId = event.target.dataset.orderId;
      const newStatus = event.target.value;
      updateOrderStatus(orderId, newStatus);
    }
  });

  // Event listener for "View Details" button (Modal functionality)
  ordersTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-view-details")) {
      const orderId = event.target.dataset.orderId;
      const allOrders = getAllOrders();
      const order = allOrders.find((o) => o.id === orderId);

      if (order) {
        // Populate modal with order details
        document.getElementById("detailOrderId").textContent =
          order.id || "N/A";
        document.getElementById("detailOrderDate").textContent =
          formatOrderDate(order.date); // Use the new format function

        const detailStatusSpan = document.getElementById("detailOrderStatus");
        detailStatusSpan.textContent = order.status || "Unknown";
        detailStatusSpan.className = `status-badge ${
          order.status ? order.status.toLowerCase().replace(/\s/g, "-") : ""
        }`;

        document.getElementById("detailCustomerName").textContent =
          order.customer ? order.customer.name : "N/A";
        document.getElementById("detailCustomerEmail").textContent =
          order.customer ? order.customer.email : "N/A";
        document.getElementById("detailCustomerPhone").textContent =
          order.customer ? order.customer.phone : "N/A";

        document.getElementById("detailCustomerAddress").textContent =
          order.customer ? order.customer.address : "N/A";
        document.getElementById("detailCustomerZone").textContent =
          order.customer ? order.customer.zone : "N/A";

        // Populate order items in modal dynamically
        const modalOrderItemsContainer =
          document.getElementById("modalOrderItems");
        modalOrderItemsContainer.innerHTML = ""; // Clear previous items
        if (order.items && order.items.length > 0) {
          order.items.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("detail-item");
            itemDiv.innerHTML = `
                            <span>${item.name} x ${item.quantity}</span>
                            <span>${formatCurrency(item.subtotal)}</span>
                        `;
            modalOrderItemsContainer.appendChild(itemDiv);
          });
          // Add products subtotal if available
          const productsSubtotalDiv = document.createElement("div");
          productsSubtotalDiv.classList.add("detail-item");
          productsSubtotalDiv.innerHTML = `
                         <span>Products Subtotal</span>
                         <span>${formatCurrency(
                           order.orderTotal.productsSubtotal
                         )}</span>
                     `;
          modalOrderItemsContainer.appendChild(productsSubtotalDiv);
        } else {
          modalOrderItemsContainer.innerHTML = `<div class="detail-item"><span>No specific items recorded.</span></div>`;
        }

        document.getElementById("detailDeliveryFee").textContent =
          formatCurrency(order.orderTotal ? order.orderTotal.deliveryFee : 0);
        document.getElementById("detailTotal").textContent = formatCurrency(
          order.orderTotal ? order.orderTotal.total : 0
        );
        document.getElementById("detailPaymentMethod").textContent =
          order.orderTotal ? order.orderTotal.paymentMethod : "N/A";

        orderDetailsModal.style.display = "block"; // Show the modal
      }
    }
  });

  // Close modal button
  closeModalBtn.addEventListener("click", function () {
    orderDetailsModal.style.display = "none";
  });

  // Close modal if clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === orderDetailsModal) {
      orderDetailsModal.style.display = "none";
    }
  });

  // Handle "Update Status" button within the modal (optional: to change status from modal)
  document
    .getElementById("updateStatusBtn")
    .addEventListener("click", function () {
      const orderId = document.getElementById("detailOrderId").textContent;
      const currentStatus =
        document.getElementById("detailOrderStatus").textContent;

      const possibleStatuses = [
        "Pending",
        "Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];
      const newStatus = prompt(
        `Enter new status for Order ${orderId} (e.g., ${possibleStatuses.join(
          ", "
        )}):`,
        currentStatus
      );

      if (newStatus && possibleStatuses.includes(newStatus)) {
        updateOrderStatus(orderId, newStatus);
        orderDetailsModal.style.display = "none"; // Close modal after update
      } else if (newStatus) {
        alert(
          "Invalid status entered. Please choose from: " +
            possibleStatuses.join(", ")
        );
      }
    });

  // Initial display of orders when the admin page loads
  displayAdminOrders();

  // --- Theme Toggle Functionality (from your existing code) ---
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      document.body.classList.toggle("dark-mode");
      // Save theme preference to localStorage (optional)
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
    // Apply saved theme on load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }

  // --- Admin Dropdown Functionality (from your existing code) ---
  const adminProfile = document.querySelector(".admin-profile");
  if (adminProfile) {
    adminProfile.addEventListener("click", (event) => {
      const dropdownMenu = adminProfile.querySelector(".admin-dropdown-menu");
      dropdownMenu.classList.toggle("show");
      event.stopPropagation(); // Prevent click from immediately closing it
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", function (event) {
      if (!event.target.closest(".admin-profile")) {
        // Check if click is outside the profile div
        const dropdowns = document.getElementsByClassName(
          "admin-dropdown-menu"
        );
        for (let i = 0; i < dropdowns.length; i++) {
          const openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }
      }
    });
  }
});
