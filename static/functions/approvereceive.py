import pandas as pd

def approve_receive_request_function(data):
    try:
        print('Received data:', data)

        # Extract FormNo from the first dictionary
        form_id = data[0]['FormNo']
        print('Form ID:', form_id)

        try:
            # Load the handover_data Excel file into a pandas DataFrame
            df_handover = pd.read_excel("Excel/handover_data.xlsx")
            print('Loaded handover_data.xlsx successfully')
        except Exception as e:
            print(f"Error loading handover_data.xlsx: {e}")
            return

        # Update DataFrame
        try:
            form_found = False
            for index, row in df_handover.iterrows():
                if row['FormID'] == form_id:
                    df_handover.at[index, 'ApprovalToReceive'] = 'YES'
                    df_handover.at[index, 'Status'] = 'Approved'
                    form_found = True
            if not form_found:
                print(f"FormID {form_id} not found in handover_data.xlsx")
            else:
                # Save the updated DataFrame back to Excel
                df_handover.to_excel("Excel/handover_data.xlsx", index=False)
                print('Updated and saved handover_data.xlsx successfully')
        except Exception as e:
            print(f"Error updating handover_data.xlsx: {e}")
            return

        try:
            # Load the inventory Excel file into a pandas DataFrame
            df_inventory = pd.read_excel("Excel/inventory.xlsx")
            print('Loaded inventory.xlsx successfully')
        except Exception as e:
            print(f"Error loading inventory.xlsx: {e}")
            return

        # Update inventory DataFrame based on SerialNo
        try:
            for item in data[1:]:
                serial_no = item.get('ProductID')
                condition = item.get('Condition')
                owner = data[0].get('Owner')
                project = data[0].get('Project')
                print('this is the form data for each item,', item)
                print(f'Updating inventory for ProductID {serial_no} with Condition {condition}, Owner {owner}, Project {project}')

                # Find the row with matching SerialNo and update values
                if df_inventory.loc[df_inventory['ProductID'] == serial_no].empty:
                    print(f"ProductID {serial_no} not found in inventory.xlsx")
                else:
                    df_inventory.loc[df_inventory['ProductID'] == serial_no, ['Condition', 'Owner', 'Project']] = [condition, owner, project]
            # Save the updated inventory DataFrame back to Excel
            df_inventory.to_excel("Excel/inventory.xlsx", index=False)
            print('Updated and saved inventory.xlsx successfully')
        except Exception as e:
            print(f"Error updating inventory.xlsx: {e}")
            return

    except Exception as e:
        print(f"Unexpected error in approve_receive_request_function: {e}")
