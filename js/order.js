document.addEventListener("DOMContentLoaded", function () {
  // --- Product Data ---
  // Define your products here. The 'id' will link to the data-product-id in HTML.
  // Images removed from product data
  const products = [
    { id: "P001", name: "Purified Water (Per Gallon)", price: 25.0 },
    { id: "P002", name: "5 Gallons Water", price: 150.0 },
    { id: "P003", name: "Water Dispenser", price: 1250.0 },
    { id: "P004", name: "Alkaline (Per Gallon)", price: 35.0 },
    { id: "P005", name: "Distilled Water 20L", price: 320.0 },
  ];

  // --- DOM Elements ---
  const orderForm = document.getElementById("waterOrderForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const zoneSelect = document.getElementById("zone");

  const summaryProductListDiv = document.getElementById("summaryProductList");
  const totalAmountSpan = document.getElementById("totalAmount");
  const productsErrorDiv = document.getElementById("productsError");

  // --- Constants ---
  const DELIVERY_FEE = 20;

  // --- Helper function to check login status ---
  function isLoggedIn() {
    return (
      typeof window.getCurrentUser === "function" &&
      window.getCurrentUser() !== null
    );
  }

  // --- Function to show the login required modal ---
  function showLoginRequiredPopup() {
    openModal("loginRequiredModal");
    const goToLoginBtn = document.getElementById("goToLoginBtn");
    if (goToLoginBtn) {
      goToLoginBtn.onclick = function () {
        closeModal("loginRequiredModal");
        window.location.href = "login.html";
      };
    }
  }

  // --- Function to pre-fill the order form with logged-in user's data ---
  function prefillOrderForm() {
    const currentUser = window.getCurrentUser();
    if (currentUser) {
      fullNameInput.value = currentUser.name || "";
      emailInput.value = currentUser.email || "";
      phoneInput.value = currentUser.phone || "";
      addressInput.value = currentUser.address || "";
      fullNameInput.setAttribute("readonly", true);
      emailInput.setAttribute("readonly", true);
      phoneInput.setAttribute("readonly", true);
      addressInput.setAttribute("readonly", true);
    }
  }

  // --- Attach event listeners to quantity buttons ---
  function attachQuantityButtonListeners() {
    document.querySelectorAll(".increase-product").forEach((button) => {
      button.addEventListener("click", handleQuantityChange);
    });
    document.querySelectorAll(".decrease-product").forEach((button) => {
      button.addEventListener("click", handleQuantityChange);
    });
  }

  // --- Handle quantity change for individual products ---
  function handleQuantityChange(event) {
    const productId = event.target.dataset.productId;
    const quantityInput = document.querySelector(
      `.product-quantity-input[data-product-id="${productId}"]`
    );
    let currentQuantity = parseInt(quantityInput.value);

    if (event.target.classList.contains("increase-product")) {
      currentQuantity++;
    } else if (event.target.classList.contains("decrease-product")) {
      if (currentQuantity > 0) {
        // Ensure quantity doesn't go below 0
        currentQuantity--;
      }
    }
    quantityInput.value = currentQuantity;
    updateOrderSummary(); // Recalculate total
    hideError("products"); // Hide product error if quantity is now > 0
  }

  // --- Get selected products and their quantities ---
  function getSelectedProducts() {
    const selected = [];
    document
      .querySelectorAll(".product-item-order")
      .forEach((productItemDiv) => {
        const productId = productItemDiv.querySelector(
          ".product-quantity-input"
        ).dataset.productId;
        const quantityInput = productItemDiv.querySelector(
          ".product-quantity-input"
        );
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
          const product = products.find((p) => p.id === productId);
          if (product) {
            selected.push({
              ...product, // Copy product details (id, name, price)
              quantity: quantity,
              subtotal: product.price * quantity,
            });
          }
        }
      });
    return selected;
  }

  // --- Update order summary display ---
  function updateOrderSummary() {
    const selectedItems = getSelectedProducts();
    let productsSubtotal = 0;
    summaryProductListDiv.innerHTML = ""; // Clear previous summary items

    if (selectedItems.length === 0) {
      summaryProductListDiv.innerHTML =
        '<div class="summary-item"><span>No items selected</span><span></span></div>';
    } else {
      selectedItems.forEach((item) => {
        productsSubtotal += item.subtotal;
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("summary-item");
        itemDiv.innerHTML = `
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>${formatCurrency(item.subtotal)}</span>
                `;
        summaryProductListDiv.appendChild(itemDiv);
      });
    }

    const totalOrderAmount = productsSubtotal + DELIVERY_FEE;
    totalAmountSpan.textContent = formatCurrency(totalOrderAmount);
  }

  // --- Form Validation and Submission ---
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!isLoggedIn()) {
        showLoginRequiredPopup();
        return;
      }

      const fullName = fullNameInput.value;
      const email = emailInput.value;
      const phone = phoneInput.value;
      const address = addressInput.value;
      const zone = zoneSelect.value;
      const selectedProducts = getSelectedProducts();
      const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
      ).value;

      let isValid = true;

      // Validate pre-filled fields
      if (!fullName) {
        showError("fullName", "Full Name is required");
        isValid = false;
      } else {
        hideError("fullName");
      }
      if (!email) {
        showError("email", "Email is required");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address");
        isValid = false;
      } else {
        hideError("email");
      }
      if (!phone) {
        showError("phone", "Phone Number is required");
        isValid = false;
      } else {
        hideError("phone");
      }
      if (!address) {
        showError("address", "Delivery Address is required");
        isValid = false;
      } else {
        hideError("address");
      }

      // Validate Zone
      if (!zone) {
        showError("zone", "Please select your zone");
        isValid = false;
      } else {
        hideError("zone");
      }

      // Validate Product Selection (at least one item with quantity > 0)
      if (selectedProducts.length === 0) {
        showError(
          "products",
          "Please select at least one product with a quantity greater than zero."
        );
        isValid = false;
      } else {
        hideError("products");
      }

      if (isValid) {
        let productsSubtotal = 0;
        selectedProducts.forEach((item) => {
          productsSubtotal += item.subtotal;
        });
        const totalOrderAmount = productsSubtotal + DELIVERY_FEE;

        // Populate confirmation modal
        document.getElementById("confirmName").textContent = fullName;
        document.getElementById("confirmPhone").textContent = phone;
        document.getElementById("confirmAddress").textContent = address;
        document.getElementById("confirmZone").textContent = zone;

        const confirmItemsList = document.getElementById("confirmItemsList");
        confirmItemsList.innerHTML = ""; // Clear previous items
        selectedProducts.forEach((item) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${item.name} x ${
            item.quantity
          } - ${formatCurrency(item.subtotal)}`;
          confirmItemsList.appendChild(listItem);
        });

        document.getElementById("confirmPayment").textContent = paymentMethod;
        document.getElementById("confirmAmount").textContent =
          formatCurrency(totalOrderAmount);

        openModal("orderConfirmModal");
      }
    });
  }

  // --- Helper functions for error messages ---
  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
    const field = document.getElementById(fieldId);
    // Special handling for the products error, which is a div, not an input
    if (fieldId === "products") {
      productsErrorDiv.classList.add("error");
    } else {
      const fieldInput = document.getElementById(fieldId);
      if (fieldInput) {
        fieldInput.classList.add("error");
      }
    }
  }

  function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }
    // Special handling for the products error
    if (fieldId === "products") {
      productsErrorDiv.classList.remove("error");
    } else {
      const fieldInput = document.getElementById(fieldId);
      if (fieldInput) {
        fieldInput.classList.remove("error");
      }
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // --- Edit Order Button ---
  const editOrderBtn = document.getElementById("editOrderBtn");
  if (editOrderBtn) {
    editOrderBtn.addEventListener("click", function () {
      closeModal("orderConfirmModal");
    });
  }

  // --- Confirm Order Button ---
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", function () {
      closeModal("orderConfirmModal");

      const fullName = fullNameInput.value;
      const email = emailInput.value;
      const phone = phoneInput.value;
      const zone = zoneSelect.value;
      const address = addressInput.value;
      const selectedProducts = getSelectedProducts();
      const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
      ).value;

      let productsSubtotal = 0;
      selectedProducts.forEach((item) => {
        productsSubtotal += item.subtotal;
      });
      const totalOrderAmount = productsSubtotal + DELIVERY_FEE;

      const orderId = generateOrderId();

      const order = {
        id: orderId,
        customer: {
          name: fullName,
          email: email,
          phone: phone,
          address: address,
          zone: zone,
        },
        items: selectedProducts.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        orderTotal: {
          productsSubtotal: productsSubtotal,
          deliveryFee: DELIVERY_FEE,
          total: totalOrderAmount,
          paymentMethod: paymentMethod,
        },
        date: getCurrentDate(),
        status: "Pending",
      };

      saveOrder(order);

      // Populate receipt modal
      document.getElementById("receiptOrderId").textContent = orderId;
      document.getElementById("receiptDate").textContent = getCurrentDate();
      document.getElementById("receiptName").textContent = fullName;
      document.getElementById(
        "receiptAddress"
      ).textContent = `${address} (${zone})`;
      document.getElementById("receiptPhone").textContent = phone;

      const receiptProductItemsDiv = document.getElementById(
        "receiptProductItems"
      );
      receiptProductItemsDiv.innerHTML = "";
      selectedProducts.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("receipt-item");
        itemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <span>${item.quantity}</span>
                    <span>${formatCurrency(item.price)}</span>
                    <span>${formatCurrency(item.subtotal)}</span>
                `;
        receiptProductItemsDiv.appendChild(itemDiv);
      });

      document.getElementById("receiptTotal").textContent =
        formatCurrency(totalOrderAmount);
      document.getElementById("receiptPayment").textContent = paymentMethod;

      openModal("orderSuccessModal");

      // Reset form after successful order
      orderForm.reset();
      // Reset product quantities
      document.querySelectorAll(".product-quantity-input").forEach((input) => {
        input.value = 0;
      });
      updateOrderSummary(); // Update summary to reflect reset quantities
      prefillOrderForm(); // Re-call prefill to put user data back after reset
    });
  }

  // --- Back to Home Button ---
  const backToHomeBtn = document.getElementById("backToHomeBtn");
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", function () {
      closeModal("orderSuccessModal");
      window.location.href = "index.html";
    });
  }

  // --- Generic Modal Control Functions (unchanged) ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".close-modal").forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
      const modal = closeBtn.closest(".modal");
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  window.addEventListener("click", function (event) {
    document.querySelectorAll(".modal").forEach(function (modal) {
      if (event.target == modal) {
        closeModal(modal.id);
      }
    });
  });

  // --- Helper functions for order ID and date ---
  function generateOrderId() {
    return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  // Function to save order (using localStorage for client-side demo)
  function saveOrder(order) {
    console.log("Order saved:", order);
    let orders = JSON.parse(localStorage.getItem("waterStationOrders")) || [];
    orders.push(order);
    localStorage.setItem("waterStationOrders", JSON.stringify(orders));
  }

  // Function to format currency
  function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
  }

  // --- Initializations on load ---
  prefillOrderForm(); // Prefill user details
  attachQuantityButtonListeners(); // Attach listeners to the product quantity buttons
  updateOrderSummary(); // Initial summary calculation (will show ₱20.00 delivery fee and "No items selected")
});
