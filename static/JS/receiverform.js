
// Function to log row values and send them to the server
function logRowValues() {
    var formObject = [];
    var formNoLabel = document.getElementById('formNo');
    var formNoValue = formNoLabel.innerText;

    var formNoData = {
        FormID: formNoValue
    };
    formObject.push(formNoData);

    var tableBody = document.querySelector('#mainTable');
    var rows = tableBody.querySelectorAll('tr');
    rows.forEach(function(row, index) {
        if (index !== 0) {
            var cells = row.querySelectorAll('td');
            var checkbox = cells[0].querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                var conditionSelect = cells[9].querySelector('select[name="conditionReceiver"]');
                var selectedCondition = conditionSelect ? conditionSelect.value : '';

                var receiverRemarksInput = cells[10].querySelector('input[type="text"]');
                var receiverRemarks = receiverRemarksInput ? receiverRemarksInput.value : '';

                var serialNo = cells[6].innerText;

                var rowData = {
                    SerialNo: serialNo,
                    ReceiverCondition: selectedCondition,
                    ReceiverRemark: receiverRemarks,
                    Reached: checkbox.checked
                };

                formObject.push(rowData);
            }
        }
    });

    console.log("This is the formObject Data", formObject);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5001/receive_approval_request", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Success:', xhr.responseText);
                floatingMessageBox("\nYou may contact your manager to approve the form.", 'green', 'receivertable');
            } else {
                console.error('Error:', xhr.status);
                floatingMessageBox("Failed to send approval request. Please try again later.", 'red');
            }
        }
    };

    xhr.onerror = function() {
        console.error('Network Error');
        floatingMessageBox("Network error. Please check your connection and try again.", 'red');
    };

    xhr.send(JSON.stringify(formObject));
}

// Function to initialize the table and event listeners
function initializeTable(data) {
    var table = document.getElementById("mainTable");

    data.forEach(function(row, index) {
        var newRow = table.insertRow();

        var reachedCell = newRow.insertCell(0);
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${index}`;
        reachedCell.appendChild(checkbox);

        var serialNoCell = newRow.insertCell(1);
        serialNoCell.textContent = index + 1;

        var productCategoryCell = newRow.insertCell(2);
        productCategoryCell.textContent = row['Category'];

        var productNameCell = newRow.insertCell(3);
        productNameCell.textContent = row['Name'];

        var makeCell = newRow.insertCell(4);
        makeCell.textContent = row['Make'];

        var modelCell = newRow.insertCell(5);
        modelCell.textContent = row['Model'];

        var productNoCell = newRow.insertCell(6);
        productNoCell.textContent = row['ProductID'];

        var conditionCell = newRow.insertCell(7);
        conditionCell.textContent = row['SenderCondition'];

        var remarksCell = newRow.insertCell(8);
        remarksCell.textContent = row['SenderRemarks'];

        var conditionReceiverCell = newRow.insertCell(9);
        conditionReceiverCell.innerHTML = `
            <select id="conditionReceiver_${index}" name="conditionReceiver" disabled>
                <option value="">Select</option>
                <option value="Good">Good</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Damaged">Damaged</option>
            </select>
        `;

        var remarksReceiverCell = newRow.insertCell(10);
        remarksReceiverCell.innerHTML = `
            <input id="remarksReceiver_${index}" type="text" name="remarksReceiver" value="" disabled>
        `;

        checkbox.addEventListener('change', function() {
            var isChecked = checkbox.checked;
            var selectElement = document.getElementById(`conditionReceiver_${index}`);
            var inputElement = document.getElementById(`remarksReceiver_${index}`);
            if (selectElement && inputElement) {
                if (isChecked) {
                    selectElement.removeAttribute('disabled');
                    inputElement.removeAttribute('disabled');
                } else {
                    selectElement.setAttribute('disabled', 'disabled');
                    inputElement.setAttribute('disabled', 'disabled');
                }
            } else {
                console.error('Select or input element not found.');
            }
        });
    });
}

// Function to load and populate form data
function loadFormData() {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/get_form_data", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            try {
                var parsedData = JSON.parse(xhr2.responseText);
                var data = JSON.parse(parsedData);
                console.log(data);

                if (data && Array.isArray(data) && data.length > 0) {
                    var firstFormData = data[0];
                    var initiationDateTime = firstFormData['InitiationDate'];
                    var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';

                    document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                    document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                    document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
                    document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                    document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
                    document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                    document.getElementById("InitiationDate").textContent = initiationDate;

                    initializeTable(data);
                } else {
                    console.error("No form data or invalid data format received");
                    floatingMessageBox("Failed to load form data. Please try again later.", 'red');
                }
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                floatingMessageBox("Failed to load form data. Please try again later.", 'red');
            }
        }
    };
    xhr2.onerror = function() {
        console.error('Network Error');
        floatingMessageBox("Network error. Please check your connection and try again.", 'red');
    };
    xhr2.send();
}

// Event listener for the approval button
var askApprovalButton = document.getElementById("ask-approval-button");
askApprovalButton.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('[id^="checkbox_"]');
    var atLeastOneChecked = false;
    var allConditionsSelected = true;

    checkboxes.forEach(function(checkbox, index) {
        if (checkbox.checked) {
            atLeastOneChecked = true;
            var selectElement = document.getElementById(`conditionReceiver_${index}`);
            if (selectElement && selectElement.value === "") {
                floatingMessageBox("Please select a condition for the selected items", 'red');
                allConditionsSelected = false;
                return;
            }
        }
    });

    if (!atLeastOneChecked) {
        floatingMessageBox("Please select at least one item", 'red');
    } else if (atLeastOneChecked && allConditionsSelected) {
        logRowValues();
    }
});

// Load form data on window load
window.onload = loadFormData;



var disapproveButton = document.getElementById("disapproveButton");

disapproveButton.addEventListener("click", function() {
    document.getElementById('ask-approval-button').disabled = true; // Disable the button
    document.getElementById('disapproveButton').disabled = true; // Disable the button

    var formNo = document.getElementById("formNo").textContent.trim();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/disapprove_receive_approval_request", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request was successful
                console.log("Form No sent successfully!");
                console.log(formNo)
                floatingMessageBox("Form Transaction has been disapproved", 'green','approvetable');
            } else {
                // There was an error
                console.error("Error:", xhr.statusText);
            }
        }
    };
    var data = JSON.stringify({"formNo": formNo});
    xhr.send(data);
});

