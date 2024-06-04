document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("sendItemsBtn").addEventListener("click", function() {
        window.location.href = "../pages/senditems.html"; // Replace with your actual URL
    });
    
    document.getElementById("receiveItemsBtn").addEventListener("click", function() {
        window.location.href = "../pages/receiveitems.html"; // Replace with your actual URL
    });

    document.getElementById("approveItemsBtn").addEventListener("click", function() {
        window.location.href = "../pages/pendingapprovaltable.html"; // Replace with your actual URL
    });

    document.getElementById("myInventoryBtn").addEventListener("click", function() {
        window.location.href = "../pages/myinventory.html"; // Replace with your actual URL
    });

    document.getElementById("projectInventoryBtn").addEventListener("click", function() {
        window.location.href = "../pages/projectinventory.html"; // Replace with your actual URL
    });

    document.getElementById("transactionProgressBtn").addEventListener("click", function() {
        window.location.href = "../pages/transactionprogress.html"; // Replace with your actual URL
    });

    document.getElementById("transactionHistoryBtn").addEventListener("click", function() {
        window.location.href = "../pages/transactionhistory.html"; // Replace with your actual URL
    });

    document.getElementById("logoutBtn").addEventListener("click", function() {
        window.location.href = "../pages/loginpage.html"; // Replace with your actual URL
    });

    document.getElementById("viewBtn").addEventListener("click", function () {
        const targetUrl1 = this.getAttribute("data-target1");
        const targetUrl2 = this.getAttribute("data-target2");
        if (targetUrl2) {
            window.open(targetUrl2, '_blank');
        }
        if (targetUrl1) {
            window.open(targetUrl1, '_blank');
        }
    });
});
