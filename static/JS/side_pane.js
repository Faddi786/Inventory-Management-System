// In your external JavaScript file (your_script.js)
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("sendItemsBtn").addEventListener("click", function() {
        window.location.href = sendItemsUrl;
    });
    document.getElementById("receiveItemsBtn").addEventListener("click", function() {
        window.location.href = receiveItemsUrl;
    });
    document.getElementById("approveItemsBtn").addEventListener("click", function() {
        window.location.href = approveItemsUrl;
    });
    document.getElementById("transactionProgressBtn").addEventListener("click", function() {
        window.location.href = transactionProgressUrl;
    });
    document.getElementById("transactionHistoryBtn").addEventListener("click", function() {
        window.location.href = transactionHistoryUrl;
    });
    document.getElementById("myInventoryBtn").addEventListener("click", function() {
        window.location.href = myInventoryUrl;
    });
    document.getElementById("projectInventoryBtn").addEventListener("click", function() {
        window.location.href = projectInventoryUrl;
    });
    document.getElementById("totalInventoryBtn").addEventListener("click", function() {
        window.location.href = totalInventoryUrl;
    });
    document.getElementById("logoutBtn").addEventListener("click", function() {
        window.location.href = logoutBtnUrl;
    });
    document.getElementById("homepageBtn").addEventListener("click", function() {
        window.location.href = homepageBtnUrl;
    });
    document.getElementById("additemBtn").addEventListener("click", function() {
        window.location.href = additemBtnUrl;
    });
    document.getElementById("deleteitemBtn").addEventListener("click", function() {
        window.location.href = deleteitemBtnUrl;
    });

});
