document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Fetch the form data
    const formData = new FormData(this);

    // Send a POST request to the server
    fetch("/login", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // Check the response from the server
        if (data === "Account not found") {
            floatingMessageBox("Account not found. Please try again or register.", 'red');
        } else if (data === "login matched") {

            // Redirect to manager route 
            window.location.href = "/homepage";
        } 
    })
    .catch(error => {
        
        console.error("Error:", error);
        // Handle errors, e.g., show an error message to the user
    });
});

document.getElementById("registerLink").addEventListener("click", function(event) {
    window.location.href = "/register";

});

