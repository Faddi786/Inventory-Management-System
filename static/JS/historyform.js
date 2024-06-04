
// Declare the data variable at the global scope
var data;

    window.onload = function() {
      if (!sessionStorage.getItem('refreshed')) {
        // Refresh the page
        sessionStorage.setItem('refreshed', 'true');
        window.location.reload();
    }
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "/get_form_data", true);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
              parsedData = JSON.parse(xhr2.responseText);
                data = JSON.parse(parsedData);

                var table = document.getElementById("mainTable");
                console.log("We have reached")
                console.log(data)

                if (data && Array.isArray(data) && data.length > 0) {
                    var firstFormData = data[0]; // Get the first dictionary from the list
                
                    // Update labels with values from the first dictionary
                    // Assuming firstFormData contains the date in the format 'YYYY-MM-DD HH:MM:SS'
                    var initiationDateTime = firstFormData['InitiationDate'];
                
                    // Extract just the date part
                    var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                

                    // Assuming firstFormData contains the date in the format 'YYYY-MM-DD HH:MM:SS'
                    var CompletionDateTime = firstFormData['CompletionDate'];

                    // Extract just the date part
                    var CompletionDate = CompletionDateTime ? CompletionDateTime.split(' ')[0] : 'Loading Completion Date ...';


                    // Set default values for stages
                    var stage1 = 'Completed';
                    var stage2 = 'Pending';
                    var stage3 = 'Pending';
                    var stage4 = 'Pending';
                
                    // Check conditions and update stages accordingly
                    if (firstFormData['ApprovalToSend'] === 'YES') {
                        stage2 = 'Completed';
                    } else if (firstFormData['ApprovalToSend'] === 'NO') {
                        stage2 = 'Disapproved';
                        // If disapproved, set stage3 and stage4 to disapproved too
                        stage3 = 'Disapproved';
                        stage4 = 'Disapproved';
                    }
                
                    if (firstFormData['CompletionDate'] !== 'Nan') {
                        stage3 = 'Completed';
                    }
                
                    if (firstFormData['ApprovalToReceive'] === 'YES') {
                        stage4 = 'Completed';
                    }
                
                    // Update HTML elements with the computed stages
                    document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                    document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                    document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
                    document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                    document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
                    document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                    document.getElementById("InitiationDate").textContent = initiationDate;
                    document.getElementById("CompletionDate").textContent = CompletionDate;
                
                    // Update stage elements with computed stage values
                    document.getElementById("Stage1").textContent = stage1;
                    document.getElementById("Stage2").textContent = stage2;
                    document.getElementById("Stage3").textContent = stage3;
                    document.getElementById("Stage4").textContent = stage4;
                
                }
                else {
                    console.error("No form data or invalid data format received");
                    }
        


                    data.forEach(function(row, index) {
                        var newRow = table.insertRow();
                        var serialNoCell = newRow.insertCell(0);
                        serialNoCell.textContent = index + 1; // Generate dynamic serial number starting from 1
                    
                        var checkboxCell = newRow.insertCell(1); // Checkbox cell
                    
                        // Check if stage2 is rejected
                        if (stage2 !== 'Disapproved') {
                            var checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.checked = row['Reached'] === 1; // Assuming 'Reached' is a string
                            checkbox.disabled = true;
                            checkboxCell.appendChild(checkbox);
                        }
                    
                        var productCategoryCell = newRow.insertCell(2);
                        productCategoryCell.textContent = row['Category'];
                    
                        var ProductNoCell = newRow.insertCell(3);
                        ProductNoCell.textContent = row['ProductID'];
                    
                        var productNameCell = newRow.insertCell(4);
                        productNameCell.textContent = row['Name'];
                    
                        var productNameCell = newRow.insertCell(5);
                        productNameCell.textContent = row['Make'];
                    
                        var ModelCell = newRow.insertCell(6);
                        ModelCell.textContent = row['Model'];
                    
                        var SenderconditionCell = newRow.insertCell(7);
                        SenderconditionCell.textContent = row['SenderCondition'];
                    
                        var SenderremarksCell = newRow.insertCell(8);
                        SenderremarksCell.textContent = row['SenderRemarks'];
                    
                        var ReceiverconditionCell = newRow.insertCell(9);
                        ReceiverconditionCell.textContent = row['ReceiverCondition'];
                    
                        var ReceiverremarksCell = newRow.insertCell(10);
                        ReceiverremarksCell.textContent = row['ReceiverRemark'];
                    });
                    
           }
        };
        xhr2.send();
    };
