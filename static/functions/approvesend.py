import pandas as pd
from static.functions import common_functions
from xlsxwriter import Workbook

def approve_send_request_function(form_data):
    # Read the Excel file into a DataFrame, ensuring the 'EwayBillNo' column is read as strings
    df = pd.read_excel('Excel/handover_data.xlsx', dtype={'EwayBillNo': str})

    # Extract 'FormNo' and 'EwayBill' from the form_data
    formNo = form_data[1]['FormNo']
    ewayBill = str(form_data[0]['EwayBill'])  # Convert the ewayBill to string

    # Print all values in the 'EwayBillNo' column
    print("EwayBillNo column values:", df['EwayBillNo'].values)


    # Check if the ewayBill already exists in the 'EwayBillNo' column
    if ewayBill in df['EwayBillNo'].values:
        return "Eway Bill Exists"

    # Check if the EwayBill is empty or contains only spaces
    if ewayBill == '' or ewayBill.isspace():
        ewayBill = '-'

    # Update the 'EwayBillNo' and 'ApprovalToSend' columns where 'FormID' matches the formNo received in the form data
    df.loc[df['FormID'] == formNo, ['EwayBillNo', 'ApprovalToSend']] = (ewayBill, 1)

    # Write the updated DataFrame back to the Excel file
    with pd.ExcelWriter('Excel/handover_data.xlsx', engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False)

    return "Approval has been successfully given"


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





