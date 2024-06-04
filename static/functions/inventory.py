import pandas as pd
from flask import Flask, jsonify
import json

def my_invent_dashboard_function(name, session_data):
    try:
        # Get the name from session data
        print("this is the global employee name", name)
        
        # Read Excel file
        excel_data = pd.read_excel('Excel/inventory.xlsx')
        
        # Replace NaN values with 'NAN'
        excel_data = excel_data.fillna('NAN')
        
        # Filter data based on 'CurrentOwner' column
        filtered_data = excel_data[excel_data['Owner'] == name]
        
        # Convert filtered data to dictionary
        filtered_data_dict = filtered_data.to_dict(orient='records')
        
        # Combine filtered data with session data
        combined_data = {
            "filtered_data": filtered_data_dict,
            "session_data": session_data
        }
        print("this is the combined data before jsoifying",combined_data)
        # Return JSON object
        return jsonify(combined_data)
    except Exception as e:
        return jsonify({'error': str(e)})



def my_project_dashboard_function(project,session_data):
    try:
        # Read Excel file
        excel_data = pd.read_excel('Excel/inventory.xlsx')
        
        # Replace NaN values with 'NAN'
        excel_data = excel_data.fillna('nan')
        print('excel data',excel_data)

        # Filter rows where 'FromProject' or 'ToProject' column matches the project variable
        filtered_data = excel_data[(excel_data['Project'] == project)]
        
        # Convert filtered data to list of dictionaries
        filtered_data_dict = filtered_data.to_dict(orient='records')


        # Combine filtered data with session data
        combined_data = {
            "filtered_data": filtered_data_dict,
            "session_data": session_data
        }
        



        # Return filtered data as JSON
        return jsonify(combined_data)
    except Exception as e:
        return jsonify({'error': str(e)})




def invent_dashboard_function(session_data):
    try:
        # Read Excel file
        excel_data = pd.read_excel('Excel/inventory.xlsx')
        
        # Replace NaN values with 'NAN'
        excel_data = excel_data.fillna('nan')
        
        # Convert data to list of dictionaries
        filtered_data_dict = excel_data.to_dict(orient='records')


        # Combine filtered data with session data
        combined_data = {
            "filtered_data": filtered_data_dict,
            "session_data": session_data
        }
        

        
        # Return data as JSON
        return jsonify(combined_data)
    except Exception as e:
        return jsonify({'error': str(e)})


