let inventoryData;
let initiatedData;
let selectedItems = []; // Array to store IDs of selected items

// Call toggleSelectedItemsHeader in other relevant places
window.onload = function() {
  fetch('/cart_items')
      .then(response => response.json())
      .then(result => {
          const combinedData = result.combined_data;
          if (Array.isArray(combinedData) && combinedData.length === 4) {
              const firstArray = combinedData[2];
              if (Array.isArray(firstArray) && firstArray.length > 0) {
                  const firstDictionary = firstArray[0];
                  if (firstDictionary && typeof firstDictionary === 'object') {
                      const personValue = firstDictionary.Name;
                      const projectValue = firstDictionary.Project;
                      document.getElementById('Sender').textContent = personValue;
                      document.getElementById('Source').textContent = projectValue;
                  }
              }
              console.log(combinedData)
              inventoryData = combinedData[0];
              initiatedData = combinedData[1];
              displaySelectTable();
              toggleSelectedItemsHeader();
              adjustButtonsVisibility(combinedData[3])
              const nameProjectDict = combinedData[1];

              const receiverDropdown = document.getElementById('Receiver');
              const destinationDropdown = document.getElementById('Destination');

              function populateReceiverDropdown(selectedProject) {
                  receiverDropdown.innerHTML = '';

                  for (const name in nameProjectDict) {
                      if (nameProjectDict.hasOwnProperty(name) && nameProjectDict[name] === selectedProject) {
                          const option = document.createElement('option');
                          option.value = name;
                          option.textContent = name;
                          receiverDropdown.appendChild(option);
                      }
                  }
              }

              const uniqueProjects = new Set(Object.values(nameProjectDict));
              uniqueProjects.forEach(project => {
                  const option = document.createElement('option');
                  option.value = project;
                  option.textContent = project;
                  destinationDropdown.appendChild(option);
              });

              destinationDropdown.addEventListener('change', function() {
                  const selectedProject = this.value;
                  populateReceiverDropdown(selectedProject);
              });

              showSelectTab();
          } else {
              console.error('Combined data is not valid:', combinedData);
          }
      })
      .catch(error => console.error('Error fetching data:', error));
};

function toggleSelectedItemsHeader() {
    const noItemsHeader = document.getElementById('no-items-selected');
    const table = document.getElementById('maintable');
    if (!table) {
        console.error('Table "maintable" not found');
        return;
    }

    const tbody = table.querySelector('tbody');

    if (!tbody || tbody.children.length === 0) {
        noItemsHeader.style.display = 'block';
        noItemsHeader.textContent = 'No items selected';
    } else {
        noItemsHeader.style.display = 'none';
    }
}



function showItemsSelectedTab() {
  clearTabs();
  document.getElementById('itemsSelected').style.display = 'block';
  document.getElementById('selectableTab').style.display = 'none';
  document.getElementById('selected-items').style.backgroundColor = '#404040'
  document.getElementById('choose-items').style.backgroundColor = '#262626'
  displayItemsSelectedTable();
  toggleSelectedItemsHeader();
}

function showSelectTab() {
    clearTabs();
    document.getElementById('selectableTab').style.display = 'block';
    document.getElementById('itemsSelected').style.display = 'none';
    document.getElementById('selected-items').style.backgroundColor = '#262626'
    document.getElementById('choose-items').style.backgroundColor = '#404040'
    displaySelectTable();
}

function clearTabs() {
    document.getElementById('itemsSelected').style.display = 'none';
    document.getElementById('selectableTab').style.display = 'none';
}

let selectableData = [];

function calculateSelectableData() {
    selectableData = [];
    inventoryData.forEach(inventoryItem => {
        const itemId = inventoryItem.SerialNo;
        const isInInitiatedData = initiatedData.hasOwnProperty(itemId);
        if (!isInInitiatedData) {
            const disabled = isSelected(itemId); // Check if item is selected
            selectableData.push([inventoryItem.Category, inventoryItem.Name, inventoryItem.Make, inventoryItem.Model, itemId, disabled]);
        }
    });
}

function handleCheckboxChange(checkbox, itemId, itemRow) {
    const table = document.getElementById('maintable');
    if (!table) {
        console.error('Table "maintable" not found');
        return;
    }

    if (checkbox.checked) {
        selectedItems.push(itemId);
        appendSelectedItem(itemRow, table);
    } else {
        selectedItems = selectedItems.filter(id => id !== itemId);
        removeSelectedItem(itemId);
    }
    displayItemsSelectedTable();
    updateSelectableData();
    toggleSelectedItemsHeader();
}



function displayItemsSelectedTable() {
    const tab = document.getElementById('itemsSelected');
    let table = document.getElementById('maintable');
    if (!table) {
        table = createTablemain(['Serial No', 'Category', 'Name', 'Make', 'Model', 'SerialNo', 'Condition', 'Remark']);
        tab.appendChild(table);
    } else {
        table.innerHTML = '';
        const headerRow = document.createElement('tr');
        ['Serial No', 'Category', 'Name', 'Make', 'Model', 'SerialNo', 'Condition', 'Remark'].forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    }

    selectedItems.forEach(itemId => {
        const item = selectableData.find(data => data[4] === itemId);
        if (item) {
            appendSelectedItem(item, table);
        }
    });
    toggleSelectedItemsHeader(); // Ensure the header is toggled after the table is updated
}





function updateSelectableData() {
    const tab = document.getElementById('selectableTab');
    const checkboxes = tab.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        const itemId = selectableData[index][4];
        const disabled = isSelected(itemId);
    });

    const firstTab = document.getElementById('itemsSelected');
    if (firstTab.style.display !== 'none') {
        const selectedTable = document.getElementById('maintable');
        if (selectedTable) {
            const selectedRows = selectedTable.querySelectorAll('tr');
            selectedRows.forEach(row => {
                const productIdCell = row.lastElementChild;
                const productId = productIdCell.textContent;
                const checkbox = checkboxes.find(checkbox => checkbox.value === productId);
                if (checkbox) {
                    const checked = checkbox.checked;
                    const index = selectedItems.indexOf(productId);
                    if (!checked && index !== -1) {
                        row.remove();
                    }
                }
            });
        }
    }
}

function displaySelectTable() {
    calculateSelectableData();
    const tab = document.getElementById('selectableTab');
    const table = createTable(['Serial', 'Select Item', 'Category', 'Name', 'Make', 'Model', 'SerialNo']);
    const tbody = table.querySelector('tbody');

    selectableData.forEach((item, index) => {
        const row = document.createElement('tr');

        const serialCell = document.createElement('td');
       
        serialCell.textContent = index + 1;
        row.appendChild(serialCell);

        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'selectItem';
        checkbox.value = item[4];
        checkbox.checked = isSelected(item[4]);
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this, item[4], item);
        });
        selectCell.appendChild(checkbox);
        row.appendChild(selectCell);

        item.slice(0, -1).forEach((value, index) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });



        tbody.appendChild(row);
    });

    tab.innerHTML = '';
    tab.appendChild(table);
}

function isSelected(itemId) {
    return selectedItems.includes(itemId);
}


function appendSelectedItem(item, table) {
    let tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }

    const row = document.createElement('tr');

    const serialNoCell = document.createElement('td');
    serialNoCell.textContent = tbody.children.length + 1;
    row.appendChild(serialNoCell);

    item.slice(0, -1).forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
    });

    const conditionCell = document.createElement('td');
    const conditionSelect = document.createElement('select');
    conditionSelect.innerHTML = '<option value="">Select Condition</option><option value="Good">Good</option><option value="Not OK">Not OK</option><option value="Damaged">Damaged</option>';
    conditionCell.appendChild(conditionSelect);
    row.appendChild(conditionCell);

    const remarkCell = document.createElement('td');
    const remarkInput = document.createElement('input');
    remarkInput.type = 'text';
    remarkInput.placeholder = 'Enter remark';
    remarkCell.appendChild(remarkInput);
    row.appendChild(remarkCell);

    tbody.appendChild(row);
}


function removeSelectedItem(itemId) {
    const table = document.getElementById('maintable');
    if (!table) {
        console.error('Table "maintable" not found');
        return;
    }

    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error('Tbody is not defined');
        return;
    }

    const rows = Array.from(tbody.children);
    rows.forEach(row => {
        if (row.children[5].textContent === itemId) {
            tbody.removeChild(row);
        }
    });

    toggleSelectedItemsHeader(); // Ensure the header is toggled when an item is removed

    // Remove tbody if it's empty to avoid keeping an empty tbody element
    if (tbody.children.length === 0) {
        table.removeChild(tbody);
    }
}




function createTable(headers) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}
function createTablemain(headers) {
    const table = document.createElement('table');
    table.id = 'maintable';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody'); // Ensure tbody is created
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody); // Ensure tbody is appended to the table
    return table;
}


