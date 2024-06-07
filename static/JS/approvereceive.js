// Declare the data variable at the global scope
var data;

window.onload = function() {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/get_form_data", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            parsedData = JSON.parse(xhr2.responseText);
            data = JSON.parse(parsedData);
            console.log("We have reached");
            console.log(data);

            if (data && Array.isArray(data) && data.length > 0) {
                var firstFormData = data[0];
                var initiationDateTime = firstFormData['InitiationDate'];
                var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                

                var completionDateTime = firstFormData['CompletionDate'];
                var completionDate = completionDateTime ? completionDateTime.split(' ')[0] : 'Loading Initiation Date ...';


                document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
                document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
                document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                document.getElementById("InitiationDate").textContent = initiationDate;
                document.getElementById("CompletionDate").textContent = completionDate;
            
                var table = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
                data.forEach(function(row, index) {
                    var newRow = table.insertRow();
                    newRow.insertCell(0).textContent = index + 1;
                
                    // Status cell
                    var statusCell = newRow.insertCell(1);
                    var statusLabel = document.createElement('label');
                    statusLabel.textContent = row['Reached'] ? 'Accepted' : 'Rejected';
                    statusCell.appendChild(statusLabel);
                
                    // Remaining data cells
                    newRow.insertCell(2).textContent = row['Category'];
                    newRow.insertCell(3).textContent = row['Name'];
                    newRow.insertCell(4).textContent = row['Make'];
                    newRow.insertCell(5).textContent = row['Model'];
                    newRow.insertCell(6).textContent = row['ProductID'];
                    newRow.insertCell(7).textContent = row['SenderCondition'];
                    newRow.insertCell(8).textContent = row['SenderRemarks'];
                    newRow.insertCell(9).textContent = row['ReceiverCondition'];
                    newRow.insertCell(10).textContent = row['ReceiverRemark'];
                });
                
            }
             else {
                console.error("No form data or invalid data format received");
            }
        }
    };
    xhr2.send();
};

var submitButton = document.getElementById("approvalButton");
submitButton.addEventListener("click", function() {
    logRowValues();
});

function logRowValues() {
    var formObject = [];
    var formNo = document.getElementById("formNo").textContent.trim();
    var toPersonValue = document.getElementById("Receiver").textContent.trim();
    var toProjectValue = document.getElementById("Destination").textContent.trim();
    var newObject = {
        FormNo: formNo,
        Owner: toPersonValue,
        Project: toProjectValue
    };
    formObject.push(newObject);

    var tableBody = document.querySelector("#mainTable tbody");
    var rows = tableBody.querySelectorAll('tr');
    rows.forEach(function(row) {
        var cells = row.querySelectorAll('td');
        var rowData = {
            ProductID: cells[6].innerText,
            Condition: cells[8].innerText
        };
        formObject.push(rowData);
    });

    console.log("This is the formObject Data for approvereceive", formObject);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5001/approve_receive_request", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Success:', xhr.responseText);
                floatingMessageBox("Approval to Receive items has been given.", 'green', 'approvetable');
            } else {
                console.error('Error:', xhr.status);
                floatingMessageBox(xhr.status, 'red');
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(formObject));
}



var disapproveButton = document.getElementById("disapproveButton");

disapproveButton.addEventListener("click", function() {
    document.getElementById('approvalButton').disabled = true; // Disable the button
    document.getElementById('disapproveButton').disabled = true; // Disable the button

    var formNo = document.getElementById("formNo").textContent.trim();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/disapprove_receive_request", true);
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


