import pandas as pd
from flask import jsonify

def transfer_progress_table_data_function(name, project, toa, session_data):
    try:
        # Load the data from the Excel file into a pandas DataFrame
        df = pd.read_excel('Excel/handover_data.xlsx')

        # Initialize empty DataFrames for Send and Receive
        Send_df = pd.DataFrame()
        Receive_df = pd.DataFrame()

        if toa == "Employee":
            Send_df = df[(df['Sender'] == name) & (df['Status'] == "Pending")]

            Receive_df = df[(df['Receiver'] == name) & (df['Status'] == "Pending")]
        elif toa == "Manager":
            Send_df = df[(df['Source'] == project) | (df['Sender'] == name) & (df['Status'] == "Pending")]
            print('this is the send df',Send_df)
            Receive_df = df[(df['Destination'] == project) | (df['Receiver'] == name) & (df['Status'] == "Pending")]
            print('this is the receive df',Receive_df)

        else:
            Send_df = df[df['Status'] == "Pending"]
            Receive_df =  df[df['Status'] == "Pending"]

        # Update columns in the DataFrames
        Send_df["TransactionType"] = "Send"
        Receive_df["TransactionType"] = "Receive"

        # Append Receive_df to Send_df
        combined_df = pd.concat([Send_df, Receive_df])

        # Remove duplicate entries based on FormID
        combined_df = combined_df.drop_duplicates(subset=['FormID'])

        # Sort the DataFrame based on "InitiationDate"
        combined_df = combined_df.sort_values(by="InitiationDate", ascending=False)

        # Convert the sorted DataFrame to dictionaries
        data_dict = combined_df.to_dict(orient='records')


        print('this is the data dict',data_dict)
        print('this is the session data',combined_df)

        
        # Apply replace_nan_with_word function on data dictionary and session_data dictionary
        data_dict = replace_nan_with_word(data_dict)
        print('this is the data dict',data_dict)
        print('this is the session data',session_data)

        
        # Combine data dictionaries
        final_data = {"filtered_data": data_dict, "session_data": session_data}

        # Convert the final data to JSON format and return
        json_data = jsonify(final_data)
        return json_data

    except Exception as e:
        print("Error converting data to JSON:", e)
        return jsonify({"error": "Error converting data to JSON"})




def replace_nan_with_word(data, word="nan"):
    if isinstance(data, dict):
        return {k: replace_nan_with_word(v, word) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_nan_with_word(item, word) for item in data]
    elif pd.isna(data):
        return word
    elif isinstance(data, pd.Timestamp):  # Convert Timestamp to datetime
        return data.strftime('%Y-%m-%d %H:%M:%S')
    else:
        return data

    return combine_data(Send_df, Receive_df)