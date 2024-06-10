let inventoryData;
let initiatedData;
let selectedItems = [];

// Fetch and process data on window load
window.onload = function() {
  fetchDataAndInitialize();
};

function fetchDataAndInitialize() {
  fetch('/cart_items')
    .then(response => response.json())
    .then(result => {
      const combinedData = result.combined_data;
      if (Array.isArray(combinedData) && combinedData.length === 4) {
        populateSenderAndSource(combinedData[2]);
        inventoryData = combinedData[0];
        initiatedData = combinedData[1];
        populateDropdowns(combinedData[1]);
        adjustButtonsVisibility(combinedData[3]);
        displaySelectTable();
        toggleSelectedItemsHeader();
        showSelectTab();
      } else {
        console.error('Combined data is not valid:', combinedData);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

function populateSenderAndSource(firstArray) {
  if (Array.isArray(firstArray) && firstArray.length > 0) {
    const firstDictionary = firstArray[0];
    if (firstDictionary && typeof firstDictionary === 'object') {
      document.getElementById('Sender').textContent = firstDictionary.Name;
      document.getElementById('Source').textContent = firstDictionary.Project;
    }
  }
}

function populateDropdowns(nameProjectDict) {
  const receiverDropdown = document.getElementById('Receiver');
  const destinationDropdown = document.getElementById('Destination');

  const uniqueProjects = new Set(Object.values(nameProjectDict));
  uniqueProjects.forEach(project => {
    const option = document.createElement('option');
    option.value = project;
    option.textContent = project;
    destinationDropdown.appendChild(option);
  });

  destinationDropdown.addEventListener('change', function() {
    const selectedProject = this.value;
    populateReceiverDropdown(selectedProject, nameProjectDict, receiverDropdown);
  });
}

function populateReceiverDropdown(selectedProject, nameProjectDict, receiverDropdown) {
  receiverDropdown.innerHTML = '';
  for (const name in nameProjectDict) {
    if (nameProjectDict[name] === selectedProject) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      receiverDropdown.appendChild(option);
    }
  }
}

function toggleSelectedItemsHeader() {
  const noItemsHeader = document.getElementById('no-items-selected');
  const table = document.getElementById('maintable');
  const tbody = table ? table.querySelector('tbody') : null;

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
  document.getElementById('selected-items').style.backgroundColor = '#404040';
  document.getElementById('choose-items').style.backgroundColor = '#262626';
  displayItemsSelectedTable();
  toggleSelectedItemsHeader();
}

function showSelectTab() {
  clearTabs();
  document.getElementById('selectableTab').style.display = 'block';
  document.getElementById('itemsSelected').style.display = 'none';
  document.getElementById('selected-items').style.backgroundColor = '#262626';
  document.getElementById('choose-items').style.backgroundColor = '#404040';
  displaySelectTable();
}

function clearTabs() {
  document.getElementById('itemsSelected').style.display = 'none';
  document.getElementById('selectableTab').style.display = 'none';
}

function calculateSelectableData() {
  return inventoryData.filter(inventoryItem => !initiatedData.hasOwnProperty(inventoryItem.SerialNo))
    .map(inventoryItem => ({
      ...inventoryItem,
      disabled: isSelected(inventoryItem.SerialNo)
    }));
}

function handleCheckboxChange(checkbox, itemId, item) {
  if (checkbox.checked) {
    selectedItems.push({ ...item, condition: '', remark: '' });
  } else {
    selectedItems = selectedItems.filter(selectedItem => selectedItem.SerialNo !== itemId);
  }
  displayItemsSelectedTable();
  toggleSelectedItemsHeader();
}

function handleConditionChange(itemId, condition) {
  const item = selectedItems.find(item => item.SerialNo === itemId);
  if (item) item.condition = condition;
}

function handleRemarkChange(itemId, remark) {
  const item = selectedItems.find(item => item.SerialNo === itemId);
  if (item) item.remark = remark;
}

function displayItemsSelectedTable() {
  const tab = document.getElementById('itemsSelected');
  const table = createTableIfNotExists('maintable', ['Serial No', 'Category', 'Name', 'Make', 'Model', 'SerialNo', 'Condition', 'Remark'], tab);
  table.innerHTML = createTableHeader(['Serial No', 'Category', 'Name', 'Make', 'Model', 'SerialNo', 'Condition', 'Remark']);
  selectedItems.forEach((item, index) => {
    appendSelectedItem(item, table, index);
  });
}

function updateSelectableData() {
  const tab = document.getElementById('selectableTab');
  const checkboxes = tab.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    const itemId = selectableData[index].SerialNo;
    checkbox.checked = isSelected(itemId);
  });
}

function displaySelectTable() {
  selectableData = calculateSelectableData();
  const tab = document.getElementById('selectableTab');
  const table = createTable(['Serial', 'Select Item', 'Category', 'Name', 'Make', 'Model', 'SerialNo']);
  const tbody = table.querySelector('tbody');

  selectableData.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><input type="checkbox" name="selectItem" value="${item.SerialNo}" ${item.disabled ? 'checked' : ''}></td>
      <td>${item.Category}</td>
      <td>${item.Name}</td>
      <td>${item.Make}</td>
      <td>${item.Model}</td>
      <td>${item.SerialNo}</td>
    `;
    row.querySelector('input[type="checkbox"]').addEventListener('change', function() {
      handleCheckboxChange(this, item.SerialNo, item);
    });
    tbody.appendChild(row);
  });

  tab.innerHTML = '';
  tab.appendChild(table);
}

function isSelected(itemId) {
  return selectedItems.some(item => item.SerialNo === itemId);
}

function appendSelectedItem(item, table, index) {
  const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.Category}</td>
    <td>${item.Name}</td>
    <td>${item.Make}</td>
    <td>${item.Model}</td>
    <td>${item.SerialNo}</td>
    <td><select><option value="">Select Condition</option><option value="Good">Good</option><option value="Not OK">Not OK</option><option value="Damaged">Damaged</option></select></td>
    <td><input type="text" placeholder="Enter remark"></td>
  `;
  const conditionSelect = row.querySelector('select');
  const remarkInput = row.querySelector('input[type="text"]');

  conditionSelect.value = item.condition;
  remarkInput.value = item.remark;

  conditionSelect.addEventListener('change', function() {
    handleConditionChange(item.SerialNo, this.value);
  });

  remarkInput.addEventListener('input', function() {
    handleRemarkChange(item.SerialNo, this.value);
  });

  tbody.appendChild(row);
}

function createTableIfNotExists(id, headers, parent) {
  let table = document.getElementById(id);
  if (!table) {
    table = createTable(headers);
    table.id = id;
    parent.appendChild(table);
  }
  return table;
}

function createTable(headers) {
  const table = document.createElement('table');
  table.innerHTML = createTableHeader(headers);
  table.appendChild(document.createElement('tbody'));
  return table;
}

function createTableHeader(headers) {
  return `<thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead>`;
}
