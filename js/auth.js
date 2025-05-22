document.addEventListener("DOMContentLoaded", function () {
  // Helper function to get the current user from localStorage
  function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }

  // Helper function to remove the current user from localStorage
  function logoutUser() {
    localStorage.removeItem("currentUser");
    // Also remove any order-related local storage if desired, though usually kept for history
    // localStorage.removeItem("waterStationOrders"); // <-- Uncomment if you want to clear orders on logout
    window.location.href = "login.html"; // Redirect to login page after logout
  }

  // This function updates the navigation links based on login status
  function updateNavigationForAuth() {
    const currentUser = getCurrentUser();
    // Select the desktop navigation login link
    const desktopLoginLink = document.querySelector(
      'nav.desktop-nav ul li a[href="login.html"]'
    );
    // Select the mobile navigation login link
    const mobileLoginLink = document.querySelector(
      'nav.mobile-nav ul li a[href="login.html"]'
    );

    // New: Select Order History navigation links
    const orderHistoryNavLink = document.getElementById("orderHistoryNavLink");
    const mobileOrderHistoryNavLink = document.getElementById(
      "mobileOrderHistoryNavLink"
    );

    if (desktopLoginLink && mobileLoginLink) {
      if (currentUser) {
        // User is logged in: Change to Logout and display user name
        desktopLoginLink.innerHTML = `Logout (${currentUser.name})`;
        desktopLoginLink.href = "#"; // Prevent default navigation
        // Remove any existing event listener to avoid duplicates
        desktopLoginLink.removeEventListener("click", logoutUser);
        desktopLoginLink.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent default link behavior
          logoutUser();
        });

        mobileLoginLink.innerHTML = `Logout (${currentUser.name})`;
        mobileLoginLink.href = "#";
        // Remove any existing event listener to avoid duplicates
        mobileLoginLink.removeEventListener("click", logoutUser);
        mobileLoginLink.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent default link behavior
          logoutUser();
        });

        // SHOW Order History links
        if (orderHistoryNavLink) orderHistoryNavLink.style.display = "block";
        if (mobileOrderHistoryNavLink)
          mobileOrderHistoryNavLink.style.display = "block";
      } else {
        // User is not logged in: Revert to Login
        desktopLoginLink.innerHTML = `Login`;
        desktopLoginLink.href = "login.html";
        // Ensure no logout listener is attached if user logs out
        desktopLoginLink.removeEventListener("click", logoutUser);

        mobileLoginLink.innerHTML = `Login`;
        mobileLoginLink.href = "login.html";
        mobileLoginLink.removeEventListener("click", logoutUser);

        // HIDE Order History links
        if (orderHistoryNavLink) orderHistoryNavLink.style.display = "none";
        if (mobileOrderHistoryNavLink)
          mobileOrderHistoryNavLink.style.display = "none";
      }
    }
  }

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Validate fields
      let isValid = true;

      // Validate Email
      if (!email) {
        showError("loginEmail", "Please enter your email");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError("loginEmail", "Please enter a valid email address");
        isValid = false;
      } else {
        hideError("loginEmail");
      }

      // Validate Password
      if (!password) {
        showError("loginPassword", "Please enter your password");
        isValid = false;
      } else {
        hideError("loginPassword");
      }

      // If form is valid, attempt login
      if (isValid) {
        // Assuming validateLogin is a placeholder function that checks credentials
        // and returns a user object or null. You'll need to implement this.
        const user = validateLogin(email, password);

        if (user) {
          // Store logged in user
          localStorage.setItem("currentUser", JSON.stringify(user));

          // Redirect based on role
          if (user.role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "index.html";
          }
          // Call updateNavigationForAuth after successful login and redirect
          // (though the redirect will cause a page reload, so this is primarily for immediate feedback
          // or if you were using a SPA-like navigation without full reloads)
          updateNavigationForAuth();
        } else {
          showError("loginEmail", "Invalid email or password");
          showError("loginPassword", "Invalid email or password");
        }
      }
    });
  }

  // Placeholder for validateLogin function
  // In a real application, this would involve server-side authentication.
  // For local testing, we'll use a hardcoded user list.
  function validateLogin(email, password) {
    const users = JSON.parse(localStorage.getItem("waterStationUsers")) || [];
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );
    return foundUser;
  }

  // Signup Form Submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const phone = document.getElementById("signupPhone").value;
      const address = document.getElementById("signupAddress").value; // NEW: Get address
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword"
      ).value;
      const termsAgreed = document.getElementById("termsAgreed").checked;

      // Validate fields
      let isValid = true;

      // Validate Name
      if (!name) {
        showError("signupName", "Please enter your full name");
        isValid = false;
      } else {
        hideError("signupName");
      }

      // Validate Email
      if (!email) {
        showError("signupEmail", "Please enter your email");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError("signupEmail", "Please enter a valid email address");
        isValid = false;
      } else {
        // Check if email is already registered
        const users =
          JSON.parse(localStorage.getItem("waterStationUsers")) || [];
        const emailExists = users.some((user) => user.email === email);

        if (emailExists) {
          showError("signupEmail", "This email is already registered");
          isValid = false;
        } else {
          hideError("signupEmail");
        }
      }

      // Validate Phone
      if (!phone) {
        showError("signupPhone", "Please enter your phone number");
        isValid = false;
      } else {
        hideError("signupPhone");
      }

      // NEW: Validate Address
      if (!address) {
        showError("signupAddress", "Please enter your delivery address");
        isValid = false;
      } else {
        hideError("signupAddress");
      }

      // Validate Password
      if (!password) {
        showError("signupPassword", "Please enter a password");
        isValid = false;
      } else if (password.length < 6) {
        showError("signupPassword", "Password must be at least 6 characters");
        isValid = false;
      } else {
        hideError("signupPassword");
      }

      // Validate Confirm Password
      if (!confirmPassword) {
        showError("signupConfirmPassword", "Please confirm your password");
        isValid = false;
      } else if (password !== confirmPassword) {
        showError("signupConfirmPassword", "Passwords do not match");
        isValid = false;
      } else {
        hideError("signupConfirmPassword");
      }

      // Validate Terms
      if (!termsAgreed) {
        showError(
          "termsAgreed",
          "You must agree to the Terms of Service and Privacy Policy"
        );
        isValid = false;
      } else {
        hideError("termsAgreed");
      }

      // If form is valid, create user
      if (isValid) {
        // Create user object
        const user = {
          name,
          email,
          password, // In a real app, hash this password!
          phone,
          address, // NEW: Include address in user object
          role: "customer", // Default role for new signups
        };

        // Save user
        saveUser(user);

        // Show success message
        alert("Account created successfully! You can now login.");

        // Redirect to login page
        window.location.href = "login.html";
      }
    });
  }

  // Placeholder for saveUser function
  function saveUser(newUser) {
    let users = JSON.parse(localStorage.getItem("waterStationUsers")) || [];
    users.push(newUser);
    localStorage.setItem("waterStationUsers", JSON.stringify(users));
  }

  // Show error message
  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }

    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("error");
    }
  }

  // Hide error message
  function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }

    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove("error");
    }
  }

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Initial call to update navigation when any page loads that includes auth.js
  // This ensures the navigation reflects login status immediately
  updateNavigationForAuth();

  // Make updateNavigationForAuth, getCurrentUser, and logoutUser globally accessible
  // if other scripts need to call them (e.g., main.js on page load)
  window.updateNavigationForAuth = updateNavigationForAuth;
  window.getCurrentUser = getCurrentUser;
  window.logoutUser = logoutUser;
});
