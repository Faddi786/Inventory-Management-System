$(document).ready(function(){
    var allData;

    // Make the AJAX request with error handling
    $.getJSON('/approval_table')
        .done(function(data) {
            allData = data;
            console.log('this is data', data);

            // Access the filtered_data property
            var filteredData = data.filtered_data;


            // Access the filtered_data property
            var sessionData = data.session_data;

            adjustButtonsVisibility(sessionData)
            // Pass the filtered data to the functions
            populateTable(filteredData);
            populateFilterDropdowns(filteredData);
            
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.error("Request Failed: " + err);
        })
        .always(function() {
            console.log("Request completed");
        });

    // Function to populate table with data
    function populateTable(data){
        var i = 0;
        $('#transactionData').empty();
        $.each(data, function(index, transaction){
            $('#transactionTable tbody').append('<tr>' +
                '<td><input type="radio" name="selection" class="radioButton" data-formid="'+ transaction.formID +'"></td>'+
                '<td>' + (++i) + '</td>' +
                '<td>' + transaction.FormID + '</td>' +
                '<td>' + transaction.EwayBillNo + '</td>' +
                '<td>' + transaction.Source + '</td>' +
                '<td>' + transaction.Destination + '</td>' +
                '<td>' + transaction.Sender + '</td>' +
                '<td>' + transaction.Receiver + '</td>' +
                '<td>' + transaction.InitiationDate + '</td>' +
                '<td>' + transaction.ApprovalType + '</td>' +
                '</tr>');
                console.log(transaction.ApprovalType);
        });
    }

    // Event listener for view button
    document.getElementById("viewButton").addEventListener("click", function() {
        var table = document.getElementById("transactionTable");
        var selectedRow;
        var approvalType;

        // Check if at least one radio button is selected
        var atLeastOneSelected = false;
        for (var i = 0; i < table.rows.length; i++) {
            var radioButton = table.rows[i].querySelector("input[type='radio']");
            if (radioButton && radioButton.checked) {
                selectedRow = table.rows[i];
                approvalType = selectedRow.cells[9].textContent.trim(); // Assuming Approval Type is the 10th column (index 9)
                atLeastOneSelected = true;
                break;
            }
        }

        // If at least one radio button is selected, proceed
        if (atLeastOneSelected) {
            var formid = selectedRow.cells[2].textContent; // Change index if needed
            console.log(formid);

            // Send the form ID to the Flask route using XMLHttpRequest
            sendFormID(formid);

            // Determine the route based on the approval type
            var route;
            if (approvalType === 'Send') {
                route = '/display_send_approval';
            } else if (approvalType === 'Receive') {
                route = '/display_receive_approval';
            } else {
                // Handle other cases, if any
                console.log('Unknown Approval Type:', approvalType);
                // You can set a default route here or handle it as per your requirement
                route = '/default_route';
            }

            // Redirect to the desired route
            window.location.href = route;
        } else {
            // If no radio button is selected, show an alert
            floatingMessageBox("Please select a radio button before viewing the form");
        }
    });

    // Function to populate filter dropdowns
    function populateFilterDropdowns(data){
        // Initialize filter dropdowns with "NONE" option
        var dropdowns = {
            formIDOptions: ['formIDFilter', 'FormID'],
            ewayOptions: ['ewayFilter', 'EwayBillNo'],
            sourceOptions: ['sourceFilter', 'Source'],
            destinationOptions: ['destinationFilter', 'Destination'],
            senderOptions: ['senderFilter', 'Sender'],
            receiverOptions: ['receiverFilter', 'Receiver'],
            doiOptions: ['doiFilter', 'InitiationDate'],
            approvalOptions: ['approvalFilter', 'ApprovalType']
        };

        for (var key in dropdowns) {
            if (dropdowns.hasOwnProperty(key)) {
                $('#' + dropdowns[key][0]).append('<option value="NONE">NONE</option>');
            }
        }

        $.each(data, function(index, item) {
            for (var key in dropdowns) {
                if (dropdowns.hasOwnProperty(key)) {
                    var dropdownId = dropdowns[key][0];
                    var itemKey = dropdowns[key][1];
                    var itemValue = item[itemKey];

                    if (!dropdowns[key].includes(itemValue)) {
                        dropdowns[key].push(itemValue);
                        $('#' + dropdownId).append('<option value="' + itemValue + '">' + itemValue + '</option>');
                    }
                }
            }
        });
    }

    // Event listeners for filter dropdowns
    function addFilterEventListener(filterId, filterKey) {
        $('#' + filterId).change(function(){
            var selectedValue = $(this).val();
            var filteredData;
            if (selectedValue == "NONE") {
                filteredData = allData;
            } else {
                filteredData = allData.filter(function(item) {
                    return item[filterKey] === selectedValue;
                });
            }
            populateTable(filteredData);
        });
    }

    addFilterEventListener('formIDFilter', 'FormID');
    addFilterEventListener('ewayFilter', 'EwayBillNo');
    addFilterEventListener('sourceFilter', 'Source');
    addFilterEventListener('destinationFilter', 'Destination');
    addFilterEventListener('senderFilter', 'Sender');
    addFilterEventListener('receiverFilter', 'Receiver');
    addFilterEventListener('doiFilter', 'InitiationDate');
    addFilterEventListener('approvalFilter', 'ApprovalType');

});

// Function to send form ID to Flask route
function sendFormID(formID) {
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "/send_formid?form_id=" + formID, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Form ID sent to Flask: " + formID);
        }
    };
    xhr.send();
}

