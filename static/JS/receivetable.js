$(document).ready(function() {
    var allData;

    // Make the AJAX request with error handling
    $.getJSON('/receive_items_table_data')
        .done(function(data) {
            allData = data.filtered_data; // Use the filtered_data from the response
            console.log('this is data', allData);

            // Access the session_data property
            var sessionData = data.session_data;

            adjustButtonsVisibility(sessionData);

            // Pass the filtered data to the functions
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

    function populateTable(data) {
        var i = 0;
        $('#transactionData').empty();
        $.each(data, function(index, transaction) {
            $('#transactionTable tbody').append('<tr>' +
                '<td><input type="radio" name="selection" class="radioButton" data-formid="' + transaction.formID + '"></td>' +
                '<td>' + (++i) + '</td>' +
                '<td>' + transaction.FormID + '</td>' +
                '<td>' + transaction.EwayBillNo + '</td>' +
                '<td>' + transaction.Source + '</td>' +
                '<td>' + transaction.Destination + '</td>' +
                '<td>' + transaction.Sender + '</td>' +
                '<td>' + transaction.Receiver + '</td>' +
                '<td>' + transaction.InitiationDate + '</td>' +
                '</tr>');
        });
    }

    function getUniqueValues(data, column) {
        return [...new Set(data.map(item => item[column]))];
    }

    function populateFilterDropdowns(data) {
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate'
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

    function attachFilterListeners() {
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate'
        };

        for (const filterId in filters) {
            if (filters.hasOwnProperty(filterId)) {
                $('#' + filterId).change(function() {
                    filterTable();
                });
            }
        }
    }

    function filterTable() {
        const filters = {
            'formIDFilter': 'FormID',
            'ewayFilter': 'EwayBillNo',
            'sourceFilter': 'Source',
            'destinationFilter': 'Destination',
            'senderFilter': 'Sender',
            'receiverFilter': 'Receiver',
            'doiFilter': 'InitiationDate'
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
    }

    document.getElementById("viewButton").addEventListener("click", function() {
        var table = document.getElementById("transactionTable");
        var selectedRow;

        // Check if at least one radio button is selected
        var radioButtons = document.querySelectorAll("input[type='radio']");
        var atLeastOneSelected = false;
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                atLeastOneSelected = true;
                break;
            }
        }

        // If at least one radio button is selected, proceed
        if (atLeastOneSelected) {
            // Iterate over the table rows
            for (var i = 0; i < table.rows.length; i++) {
                // Check if the radio button in this row is selected
                var radioButton = table.rows[i].querySelector("input[type='radio']");
                if (radioButton && radioButton.checked) {
                    selectedRow = table.rows[i];
                    break; // Exit loop if a selected row is found
                }
            }

            // If a selected row is found, retrieve data from the formid column (second column)
            if (selectedRow) {
                var formid = selectedRow.cells[2].textContent; // Change index if needed
                console.log(formid);

                // Send the form ID to the Flask route using XMLHttpRequest
                sendFormID(formid);

                // Redirect to the desired route
                window.location.href = "/receive_form_data";
            } else {
                console.log('No formid selected');
            }
        } else {
            floatingMessageBox("Please select a radio button before viewing the form");
        }
    });

    // Function to send form ID to Flask route
    function sendFormID(formID) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/send_formid?form_id=" + formID, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Form ID sent to Flask: " + formID);
            }
        };
        xhr.send();
    }
});
