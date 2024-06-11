from flask import Flask, request, render_template, jsonify
import subprocess
import json
import pandas as pd
from flask_cors import CORS  # Import CORS
from flask_cors import cross_origin
from itertools import count
import re
import os
import openpyxl
from datetime import datetime
from openpyxl import Workbook
from openpyxl import load_workbook
from flask import Flask, request, redirect, url_for
from bs4 import BeautifulSoup
from flask import session
from datetime import date
from dateutil import tz
from datetime import datetime as dt, timezone
import datetime
import datetime
from datetime import datetime
from flask import Flask, jsonify
import pandas as pd
from flask import Flask, request, render_template, jsonify
from flask import Flask, request, jsonify
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask import Flask, request, jsonify
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from flask import Flask, jsonify, request
import pandas as pd
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, render_template_string
import pandas as pd
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import request


from static.functions import handover
from static.functions import approvaltable
from static.functions.route_callings import page_routes
from static.functions import common_functions
from static.functions import approvesend
from static.functions import approvereceive
from static.functions import transfer_progress
from static.functions import receive_items
from static.functions import transaction_history
from static.functions import inventory
from static.functions import adddeleteitem


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
cors = CORS(app, resources={r"/handover_form": {"origins": "*"}})  # Enable CORS for /handover_form route
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

app.register_blueprint(page_routes)


@app.route('/manager')
def manager():
    return render_template('manager.html')

@app.route('/employee')
def employee():
    return render_template('employee.html')

    
@app.route('/get_username')
def get_username():

    name = session.get('login_row_data', {}).get('Name')

    return jsonify({'username': name})
        # Get the name from session data

@app.route('/login', methods=['POST'])
def login():
    # Load the user_info sheet from the Excel file
    user_data = pd.read_excel("Excel/user_info.xlsx")

    username = request.form['username']
    password = request.form['password']
    print(username, password)

    # Check if username and password exist in the user_data DataFrame
    matched_rows = user_data[(user_data['Name'] == username) & (user_data['Password'] == password)]

    if not matched_rows.empty:
        
        # Replace NaN values with "nan" in the matched row data
        matched_row_data = matched_rows.iloc[0].fillna("nan").to_dict()
        
        # Store the modified row data in session
        session['login_row_data'] = matched_row_data
        print("this is session dataaa  ", session['login_row_data'])

        return "login matched"

    else:
        return "Account not found"




@app.route('/get_session_data', methods=['GET'])
def get_session_data():
    print('this is the session data', session['login_row_data'])
    if 'login_row_data' not in session:
        return jsonify({"error": "User data not found in session"}), 404

    return jsonify(session['login_row_data'])


@app.route('/cart_items')
def cart_items():

    # Get the name from session data
    name = session.get('login_row_data', {}).get('Name')
    project = session.get('login_row_data', {}).get('Project')
    data = handover.cart_items_function(name, project,session.get('login_row_data', {}))
    print('this is the data hahahah',data)
    return jsonify(combined_data=data)



@app.route('/send_approval_request', methods=['POST'])
def send_approval_request():
    print('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    try:
        # Get form data from the request
        form_data = request.json
        print('this is the send approval request form data',form_data)
        handover.process_form_data(form_data)
        
        return jsonify({'message': 'Excel file updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/approval_table', methods=['GET'])
def approval_table():

    # Get the project from session data
    project = session.get('login_row_data', {}).get('Project')
        
    json_data = approvaltable.approval_table_function(project,session.get('login_row_data', {}))
    return json_data

# Initialize an empty DataFrame
json_data = pd.DataFrame()

@app.route('/send_formid')
def send_formid():
    global json_data

    form_id = request.args.get('form_id')
    print('this is the formid', form_id)
    json_data = common_functions.extract_rows_from_excel(form_id)
    print('this is the filtered df by common function', json_data)
    # Do whatever you need to do with the form ID
    json_data = filtered_df.to_json(orient="records")
    return "Form ID received successfully"



@app.route('/get_form_data')
def get_form_data():
    global json_data
    print('this is the filtered df by get_form_data for history form table', json_data)
    # Convert DataFrame to JSON

    return jsonify(json_data)


@app.route('/approve_send_request', methods=['POST'])
def approve_send_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the approve_send_request form data", form_data)
    approvesend.approve_send_request_function(form_data)
    return "Approval has been successfully given, the email is sent, the sender may proceed to send the items"


@app.route('/disapprove_send_request', methods=['POST'])
def disapprove_send_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the disapprove_send_request form data", form_data)
    approvesend.disapprove_send_request_function(form_data)
    return jsonify({'message': 'Data updated successfully.'})


@app.route('/approve_receive_request', methods=['POST'])
def approve_receive_request():

    data = request.json  # Assuming the data sent in the request body is JSON
    
    approvereceive.approve_receive_request_function(data)
    return "Approval has been successfully given, the email is sent, the sender may proceed to send the items"


@app.route('/disapprove_receive_request', methods=['POST'])
def disapprove_receive_request():

    data = request.json  # Assuming the data sent in the request body is JSON
    
    approvereceive.disapprove_receive_request_function(data)
    return "Approval has been successfully given, the email is sent, the sender may proceed to send the items"




@app.route('/transfer_progress_table_data')
def transfer_progress_table_data():
    try:
        name = session.get('login_row_data', {}).get('Name')

        project = session.get('login_row_data', {}).get('Project')

        toa = session.get('login_row_data', {}).get('TypeOfAccount')
        print('this is the session data',session.get('login_row_data', {}))
        data = transfer_progress.transfer_progress_table_data_function(name, project, toa, session.get('login_row_data', {}))
        
        print(data)

        return data

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/receive_items_table_data', methods=['GET'])
def recieve_items_table_data():

    name = session.get('login_row_data', {}).get('Name')

    data = receive_items.receive_items_table_data_function(name,session.get('login_row_data', {}))

    print('this is the data before returning for receive items table data')
    return data


@app.route('/receive_approval_request', methods=['POST'])
def receive_approval_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the receive_approval_request form data", form_data)
    receive_items.receive_approval_request_function(form_data)
    return "Mail for approval of receiving item is sent, you may contact your manager to approve it."



@app.route('/disapprove_receive_approval_request', methods=['POST'])
def disapprove_receive_approval_request():
    form_data = request.json  # Assuming the form data is sent as JSON
    print("This is the receive_approval_request form data", form_data)
    receive_items.disapporve_receive_approval_request_function(form_data)
    return "Mail for approval of receiving item is sent, you may contact your manager to approve it."






@app.route('/transaction_history_table', methods=['GET'])
def transaction_history_table():

    name = session.get('login_row_data', {}).get('Name')
    project = session.get('login_row_data', {}).get('Project')
    toa = session.get('login_row_data', {}).get('TypeOfAccount')

    data = transaction_history.transaction_history_table_function(name,project,toa,session.get('login_row_data', {}))
    
    return data

@app.route('/my_invent_dashboard')
def my_invent_dashboard():
    name = session.get('login_row_data', {}).get('Name', 'Unknown')
    print(session.get('login_row_data', {}))
    data = inventory.my_invent_dashboard_function(name,session.get('login_row_data', {}))
    print('this is the myinvent data',data)
    return data



@app.route('/my_project_dashboard')
def my_project_dashboard():
    project = session.get('login_row_data', {}).get('Project')
    print('session data in my project inventory',session.get('login_row_data', {}))

    data = inventory.my_project_dashboard_function(project,session.get('login_row_data', {}))
    print('my project inventory data',data)
    return data


@app.route('/invent_dashboard')
def invent_dashboard():
    data = inventory.invent_dashboard_function(session.get('login_row_data', {}))
    return data





@app.route('/additem', methods=['POST'])
def additem():
    # Get data from the POST request
    data = request.json


    result = adddeleteitem.additem(data)

    return result 
    



@app.route('/deleteitem', methods=['POST'])
def deleteitem():

    # Get data from the POST request
    data = request.json

    result = adddeleteitem.deleteitem(data)

    return result





if __name__ == "__main__":
    app.run(debug=True, port=5001)