from flask import Flask, request, jsonify
import pandas as pd

app = Flask(_name_)

def add_item():
    data = request.json
    product_id = data.get('productId')
    
    db = get_db()
    
    # Check if productId exists
    existing_item = db.execute('SELECT * FROM items WHERE product_id = ?', (product_id,)).fetchone()
    
    if existing_item:
        return jsonify({'message': 'Product ID already exists'}), 400
@app.route('/additem', methods=['POST'])
def add_item():
    data = request.json
    response = additem(data)
    return response

@app.route('/deleteitem', methods=['POST'])
def delete_item():
    data = request.json
    response = deleteitem(data)
    return response

def additem(data):
    # Load the Excel file
    excel_file = "Excel/inventory.xlsx"
    df = pd.read_excel(excel_file)

    # Extract values from the JSON data
    category = data['category']
    name = data['name']
    make = data['make']
    model = data['model']
    product_id = data['productId']
    owner = data['owner']
    project = data['project']

    # Check if productId already exists
    if product_id in df['ProductID'].values:
        return jsonify({'message': 'Product ID already exists'}), 400

    # Check if category, owner, and project exist in their respective columns
    cat_flag = category in df['Category'].values
    owner_flag = owner in df['Owner'].values
    project_flag = project in df['Project'].values
    

    if cat_flag and owner_flag and project_flag:
        # Create a new DataFrame with the new entry
        new_entry = pd.DataFrame({
            'Category': [category],
            'Name': [name],
            'Make': [make],
            'Model': [model],
            'ProductID': [product_id],
            'Owner': [owner],
            'Project': [project],
            'Condition': ['Good']  # Assuming condition will be updated later
        })

        # Concatenate the new entry to the existing DataFrame
        df = pd.concat([df, new_entry], ignore_index=True)

        # Save the updated DataFrame back to the Excel file
        df.to_excel(excel_file, index=False)

        return jsonify({'message': 'Item added successfully'})
    else:
        return jsonify({'message': 'Category, owner, or project does not exist in the database'})

def deleteitem(data):
    # Load the Excel file
    excel_file = "Excel/inventory.xlsx"
    df = pd.read_excel(excel_file)

    # Extract values from the JSON data
    category = data['category']
    name = data['name']
    make = data['make']
    model = data['model']
    product_id = data['productId']
    owner = data['owner']
    project = data['project']

    # Find and remove the matching row
    condition = (
        (df['Category'] == category) &
        (df['Name'] == name) &
        (df['Make'] == make) &
        (df['Model'] == model) &
        (df['ProductID'] == product_id) &
        (df['Owner'] == owner) &
        (df['Project'] == project)
    )

    if not df[condition].empty:
        df = df[~condition]
        df.to_excel(excel_file, index=False)
        return jsonify({'message': 'Item deleted successfully'})
    else:
        return jsonify({'message': 'No matching item found in the database'})

if _name_ == '_main_':
    app.run(debug=True)