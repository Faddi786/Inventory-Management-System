$(document).ready(function(){
    var allData;

    // Make the AJAX request with error handling
    $.getJSON('/transaction_history_table')
        .done(function(data) {
            allData = data.filtered_data;
            var sessionData = data.session_data;

            console.log('this is data', allData);

            adjustButtonsVisibility(sessionData);

            populateTable(allData);
            populateFilterDropdowns(allData);
            attachFilterListeners();
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
                '<td>' + transaction.TransactionType + '</td>' +
                '<td>' + transaction.Status + '</td>' +
                '</tr>');
        });
    }

    // Event listener for view button
    document.getElementById("viewButton").addEventListener("click", function() {
        var table = document.getElementById("transactionTable");
        var selectedRow;

        // Check if at least one radio button is selected
        var atLeastOneSelected = false;
        for (var i = 0; i < table.rows.length; i++) {
            var radioButton = table.rows[i].querySelector("input[type='radio']");
            if (radioButton && radioButton.checked) {
                selectedRow = table.rows[i];
                atLeastOneSelected = true;
                break;
            }
        }

        // If at least one radio button is selected, proceed
        if (atLeastOneSelected) {
            var formid = selectedRow.cells[2].textContent; // Change index if needed

            // Send the form ID to the Flask route using XMLHttpRequest
            sendFormID(formid);

            // Redirect to the desired route
            window.location.href = "/transaction_history_form_data";
        } else {
            // If no radio button is selected, show an alert
            floatingMessageBox("Please select a form before proceeding");
        }
    });


    // Function to get unique values for each column
    function getUniqueValues(data, column) {
        return [...new Set(data.map(item => item[column]))];
    }

    // Function to populate filter dropdowns
    function populateFilterDropdowns(data){
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate',
            'approvalFilter': 'ApprovalType'
        };

        for (const [filterId, column] of Object.entries(filters)) {
            const select = document.getElementById(filterId);
            if (select) {
                select.innerHTML = '<option value="ALL">ALL</option>'; // Reset options
                const uniqueValues = getUniqueValues(data, column);

                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.text = value;
                    select.appendChild(option);
                });
            }
        }
    }

    // Function to attach filter listeners to dropdowns
    function attachFilterListeners() {
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate',
            'approvalFilter': 'ApprovalType'
        };

        for (const filterId in filters) {
            if (filters.hasOwnProperty(filterId)) {
                $('#' + filterId).change(function(){
                    filterTable();
                });
            }
        }
    }

    // Function to filter the table based on dropdown values
    function filterTable() {
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate',
            'approvalFilter': 'ApprovalType'
        };

        let filteredData = allData;

        for (const [filterId, column] of Object.entries(filters)) {
            const filterValue = $('#' + filterId).val();
            if (filterValue !== 'ALL') {
                filteredData = filteredData.filter(item => {
                    if (!isNaN(item[column]) && !isNaN(filterValue)) {
                        // If both the item and filter value are numbers, compare them as numbers
                        return parseFloat(item[column]) === parseFloat(filterValue);
                    } else {
                        // If either the item or filter value is not a number, compare them as strings
                        return item[column].toString() === filterValue.toString();
                    }
                });
            }
        }

        populateTable(filteredData);
        // Optionally, update dropdowns based on filtered data
        // updateDropdowns(filteredData, filters);
    }
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
