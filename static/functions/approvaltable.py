import pandas as pd
import json
from datetime import datetime

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

def approval_table_function(project, session_data):
    # Load the data from the Excel file into a pandas DataFrame
    df = pd.read_excel('Excel/handover_data.xlsx')

    # Filter the DataFrame based on the parameters
    source_df = df[(df['Source'] == project) & (df["ApprovalToSend"] != "YES") & (df["Status"] == "Pending") & (df["ApprovalToReceive"] != "YES")]
    destination_df = df[(df['Destination'] == project) & (~pd.isnull(df["CompletionDate"])) & (df["Status"] == "Pending")]

    # Drop duplicates based on "FormID" in both dataframes
    source_df = source_df.drop_duplicates(subset="FormID")
    destination_df = destination_df.drop_duplicates(subset="FormID")

    # Update columns in the DataFrames
    destination_df["ApprovalType"] = "Receive"
    source_df["ApprovalType"] = "Send"

    # Append destination_df to source_df
    source_df = pd.concat([source_df, destination_df])

    # Sort the DataFrame based on "InitiationDate" in descending order
    source_df = source_df.sort_values("InitiationDate", ascending=False)

    # Convert the filtered DataFrame to a dictionary
    source_data_dict = source_df.to_dict(orient='records')

    # Replace all NaN values in the dictionary with the word 'nan'
    source_data_dict = replace_nan_with_word(source_data_dict)

    # Replace all NaN values in the session_data dictionary with the word 'nan'
    session_data = replace_nan_with_word(session_data)

    # Append the session_data dictionary
    combined_data = {
        "filtered_data": source_data_dict,
        "session_data": session_data
    }

    # Convert the combined data to a JSON object
    json_result = json.dumps(combined_data)

    # Return the JSON object
    return json_result
