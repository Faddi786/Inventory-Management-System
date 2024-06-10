import pandas as pd
from static.functions import common_functions
from xlsxwriter import Workbook

def approve_send_request_function(form_data):
    # Read the Excel file into a DataFrame
    df = pd.read_excel('Excel/handover_data.xlsx')

    # Extract 'FormNo' and 'EwayBill' from the form_data
    formNo = form_data[1]['FormNo']
    ewayBill = form_data[0]['EwayBill']

    # Check if the EwayBill is empty or contains only spaces
    if ewayBill == '' or ewayBill.isspace():
        ewayBill = '-'

    # Update the 'EwayBillNo' and 'ApprovalToSend' columns where 'FormID' matches the formNo received in the form data
    df.loc[df['FormID'] == formNo, ['EwayBillNo', 'ApprovalToSend']] = (ewayBill, 1)

    # Write the updated DataFrame back to the Excel file
    with pd.ExcelWriter('Excel/handover_data.xlsx', engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False)


def disapprove_send_request_function(form_data):
    # Read the Excel file into a DataFrame
    df = pd.read_excel('Excel/handover_data.xlsx')

    # Extract formNo from the form_data
    formNo = form_data['formNo']
    print(formNo)
    
    # Update the 'status' column to 'Rejected' where 'FormID' matches the formNo received in the form data
    df.loc[df['FormID'] == formNo, ['Status', 'ApprovalToSend']] = ['Rejected', 0]

    # Write the updated DataFrame back to the Excel file
    with pd.ExcelWriter('Excel/handover_data.xlsx', engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False)    





