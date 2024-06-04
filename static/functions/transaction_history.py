import pandas as pd
from flask import jsonify

def transaction_history_table_function(name, project, session_data):
    try:
        # Load the data from the Excel file into a pandas DataFrame
        df = pd.read_excel('Excel/handover_data.xlsx')
    except Exception as e:
        print("Error loading data from Excel file:", e)
        return jsonify({"error": "Error loading data from Excel file"})

    Send_df = df[((df['Source'] == project) | (df['Sender'] == name)) & (df["Status"] != "Pending")]
    Receive_df = df[((df['Destination'] == project) | (df['Receiver'] == name)) & (df["Status"] != "Pending")]

    # Update columns in the DataFrames
    Send_df["TransactionType"] = "Send"
    Receive_df["TransactionType"] = "Receive"

    try:
        # Iterate over unique FormID present in both Send and Receive DataFrames
        common_form_ids = set(Send_df['FormID']).intersection(Receive_df['FormID'])
        for form_id in common_form_ids:
            # Update TransactionType in Send_df
            Send_df.loc[Send_df['FormID'] == form_id, 'TransactionType'] = 'Send/Receive'
            # Remove corresponding rows from Receive_df
            Receive_df = Receive_df[Receive_df['FormID'] != form_id]
    except Exception as e:
        print("Error processing data:", e)
        return jsonify({"error": "Error processing data"})

    # Append Receive_df to Send_df
    combined_df = pd.concat([Send_df, Receive_df])

    try:
        # Remove duplicate entries based on FormID
        combined_df = combined_df.drop_duplicates(subset=['FormID'])

        # Sort the DataFrame based on "InitiationDate"
        combined_df = combined_df.sort_values(by="InitiationDate", ascending=False)

        # Convert the sorted DataFrame to dictionaries
        data_dict = combined_df.to_dict(orient='records')

        # Apply replace_nan_with_word function on data dictionary and session_data dictionary
        data_dict = replace_nan_with_word(data_dict)
        session_data = replace_nan_with_word(session_data)

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
