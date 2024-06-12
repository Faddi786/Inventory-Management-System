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
                

                    var CompletionDate = firstFormData['CompletionDate']
                    if (data.length>1) {
                        for (i = 0; i < data.length; i++) {
                            let allComp = data[i]
                            var CompletionDateTime = allComp['CompletionDate'];
                            if(CompletionDateTime!=0){
                                CompletionDate = CompletionDateTime.toString().split(' ')[0]
                                break;
                            }
                            // break;
                            console.log("CD: ",CompletionDateTime)
                        }
                        if(CompletionDateTime == '0'){
                            
                            CompletionDate = 'N/A'
                        }
                    }
                    
                    var stage1 = 'Completed';
                    var stage2 = 'Pending';
                    var stage3 = 'Pending';
                    var stage4 = 'Pending';
                
                    function stages(firstFormData) {

                        // Check conditions and update stages accordingly
                        if (firstFormData['ApprovalToSend'] === 1 && firstFormData['CompletionDate'] === '-' && firstFormData['ApprovalToReceive'] === '-') {
                            stage2 = 'Completed';
                            return;
                        }
                        else if (firstFormData['ApprovalToSend'] === 0) {
                            stage1 = 'Completed';
                            stage2 = 'Disapproved';
                            // If disapproved, set stage3 and stage4 to disapproved too
                            stage3 = 'Disapproved';
                            stage4 = 'Disapproved';
                            return;
                        }
    
                        console.log(data.length)
                        // Check completion dates of all other dictionaries in the list
                        if (firstFormData['ApprovalToSend'] === 1 && firstFormData['CompletionDate'] !== '-' && firstFormData['ApprovalToReceive'] === '-') {
    
                            if (data.length > 1) {
                                for (var i = 1; i < data.length; i++) {
                                    var formData = data[i - 1];
                                    let formDataAhead = data[i]
                                    var completionDateCheck = formData['CompletionDate'];
                                    let completionDateAhead = formDataAhead['CompletionDate'];
    
                                    if (completionDateCheck !== completionDateAhead) {
                                        stage3 = 'Partially Approved';
                                        stage2 = 'Completed';
                                        stage1 = 'Completed';
                                        break;
                                        return;
                                    }
                                    else if (completionDateCheck === completionDateAhead === 0) {
                                        stage2 = 'Completed';
                                        stage3 = 'Disapproved';
                                        stage4 = 'Disapproved';
                                        
    
                                    } else {
                                        stage2= 'Completed';
                                        stage3 = 'Completed';
                                    
                                    }
                                }
                            } else {
                                if (CompletionDateTime != 0 && CompletionDateTime != '-') {
                                    stage2 = 'Completed';
                                    stage3 = 'Completed'
                                    return;
                                } else if (CompletionDateTime == 0) {
                                    stage3 = 'Disapproved'
                                    stage4 = 'Disapproved'
                                    return;
                                }
                            }
                        }
    
    
                        if (firstFormData['ApprovalToReceive'] === 1) {
                            stage2 = 'Completed';
                            stage3 = 'Completed'
                            stage4 = 'Completed';
                            return;
                        }
                        else if (firstFormData['ApprovalToReceive'] === 0) {
                            stage2 = 'Completed';
                            stage3 = 'Completed';
                            stage4 = 'Disapproved';
                            return;
                        }
    
                    }
                    stages(firstFormData);
                    // Update HTML elements with the computed stages
                    document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                    document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                    document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
                    document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                    document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
                    document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                    document.getElementById("InitiationDate").textContent = initiationDate;
                    document.getElementById("CompletionDate").textContent = CompletionDate;
                    console.log("stages value",stage1,stage2,stage3,stage4)
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
                        newRow.insertCell(0).textContent = index + 1;
                    
                        // Status cell
                        var statusCell = newRow.insertCell(1);
                        var statusLabel = document.createElement('label');

                        // if(row['CompletionDate'] == "-" | row['CompletionDate'] == 0){
                        //     statusLabel.textContent = "Rejected"
                        // }
                        // else{
                        //     statusLabel.textContent = "Accepted"
                        // }
                       
                        statusLabel.textContent = (row['CompletionDate'] == "-" | row['CompletionDate'] == 0) ? 'Rejected' : 'Accepted';
                        
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
        };
        xhr2.send();
    };