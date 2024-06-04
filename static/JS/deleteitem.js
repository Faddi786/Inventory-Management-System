window.onload = function() {
    // Call Flask route to get session data
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_session_data", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Parse response as JSON
            var data = JSON.parse(xhr.responseText);
            // Call getfunction and pass data
            adjustButtonsVisibility(data)
        }
    };
    xhr.send();
};

function deleteItem() {
    var category = document.getElementById("category").value;
    var name = document.getElementById("name").value;
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var productId = document.getElementById("product-id").value;
    var owner = document.getElementById("owner").value;
    var project = document.getElementById("project").value;

    

    // Check if any input box is empty
    if (!category || !name || !make || !model || !productId || !owner || !project) {
        floatingMessageBox('Please fill all details', 'red');
        return;
    }


    // Send data to Flask route using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/deleteitem", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message === 'Item deleted successfully') {
                        floatingMessageBox('Item removed successfully', 'green', 'homepage');
                    } else if (response.message === 'No matching item found in the database') {
                        floatingMessageBox('Values do not match, please enter precise details for each input', 'red');
                    }
                } catch (e) {
                    floatingMessageBox('An error occurred while processing the response', 'red');
                }
            } else {
                floatingMessageBox('An error occurred with the request: ' + xhr.statusText, 'red');
            }
        }
    };

    xhr.onerror = function () {
        floatingMessageBox('Request failed. Please check your network connection.', 'red');
    };

    var data = JSON.stringify({
        category: category,
        name: name,
        make: make,
        model: model,
        productId: productId,
        owner: owner,
        project: project
    });

    try {
        xhr.send(data);
    } catch (e) {
        floatingMessageBox('An error occurred while sending the request', 'red');
    }
}