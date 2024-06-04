import random
import re
import pandas as pd
from openpyxl import load_workbook
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from email.mime.text import MIMEText





def extract_rows_from_excel(form_id):
    filtered_df = pd.DataFrame()

    file = 'Excel/handover_data.xlsx'
    # Read the Excel file with specific sheet name
    df = pd.read_excel(file)

    print("this is the form ID we are trying to find in the df", form_id)

    # Filter rows based on form ID
    filtered_df = df[df["FormID"] == form_id]
    
    print('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', filtered_df)

    # Replace NaN values with "Nan"
    filtered_df.fillna("Nan", inplace=True)

    # Convert filtered DataFrame to JSON
    json_data = filtered_df.to_json(orient="records")

    return json_data




def send_email(message_content, form_no, eway_bill_no=None,from_person=None,to_person=None,from_project =None ,to_project =None ):

    print("This is the email From Person:", from_person)
    print("This is the email To Person:", to_person)
    print("This is the email From Project:", from_project)
    print("This is the email To Project:", to_project)

    # Sender and receiver email addresses
    sender_email = "shaikhfahad687@gmail.com"  # Update with your Gmail address
    receiver_email = "shaikhfahad687@gmail.com"  # Update with the receiver's email address

    try:
        # Gmail SMTP server details
        smtp_server = "smtp.gmail.com"
        smtp_port = 587  # Port for TLS encryption

        # Login credentials (use app password)
        email_password = "rgbbdlhpyleheico"  # Update with your Gmail app password

        # Establish a secure connection with the SMTP server
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            # Login to the SMTP server
            server.login(sender_email, email_password)
            
            # Create a multipart message
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            
            if message_content == "Send Form":
                message["Subject"] = "Handover Transaction details"
                body_message = f"I want to send items, The excel sheet of the eway bill is attached below. Please generate the eway bill and approve this form. The form details are as follows:\n\nForm no: {form_no}\nFrom Project: {from_project}\nTo Project: {to_project}\nFrom Person: {from_person}\nTo Person: {to_person}"                
                # Add body to email
                message.attach(MIMEText(body_message, "plain"))
                
                # Get the current working directory
                current_directory = os.getcwd()
                # Assuming the Excel sheet is in the same directory, change the filename if it's different
                excel_file_path = os.path.join(current_directory, "Excel/eway_bill.xlsx")

                # Open the Excel file in binary mode
                with open(excel_file_path, "rb") as attachment:
                    # Add Excel file as application/octet-stream
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(attachment.read())

                # Encode file in ASCII characters to send by email    
                encoders.encode_base64(part)

                # Add header as key/value pair to attachment part
                part.add_header("Content-Disposition", f"attachment; filename= {os.path.basename(excel_file_path)}")

                # Add attachment to message
                message.attach(part)
                
            elif message_content == "Receive Form":
                message["Subject"] = "Receive Form details"
                body_message = f"I have received the items, need your approval to proceed with using them, please approve this form. The form details are as follows:\n\nForm no: {form_no}\nEway Bill no: {eway_bill_no}\nFrom Project: {from_project}\nTo Project: {to_project}\nFrom Person: {from_person}\nTo Person: {to_person}"
                
                # Add body to email
                message.attach(MIMEText(body_message, "plain"))
                
            elif message_content == "Send Approval Form":
                message["Subject"] = "Send Approval Form details"
                body_message = f"I have granted permission to transfer items. The form details are as follows:\n\nForm no: {form_no}\nEway Bill no: {eway_bill_no}\nFrom Project: {from_project}\nTo Project: {to_project}\nFrom Person: {from_person}\nTo Person: {to_person}"
                
                # Add body to email
                message.attach(MIMEText(body_message, "plain"))
                
            elif message_content == "Receive Approval Form":
                message["Subject"] = "Receive Approval Form details"
                body_message = f"I have granted permission to accept the items received. The form details are as follows:\n\nForm no: {form_no}\nEway Bill no: {eway_bill_no}\nFrom Project: {from_project}\nTo Project: {to_project}\nFrom Person: {from_person}\nTo Person: {to_person}"

                
                # Add body to email
                message.attach(MIMEText(body_message, "plain"))

            # Convert the message to string
            str_message = message.as_string()
            
            # Send email
            server.sendmail(sender_email, receiver_email, str_message)
    except Exception as e:
        print(f"An error occurred: {e}")