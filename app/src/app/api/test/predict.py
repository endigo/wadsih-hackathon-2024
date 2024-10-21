import sys
import json
import joblib
import pandas as pd

# Load the preprocessor and model
preprocessor = joblib.load('preprocessor.pkl')
baseline_xgb_model = joblib.load('xgb_model.pkl')

# Parse the input JSON data
input_data = json.loads(sys.argv[1])
input_df = pd.DataFrame([input_data])

# Preprocess the input data
input_data_preprocessed = preprocessor.transform(input_df)

# Predict the wait time
predicted_wait_time = baseline_xgb_model.predict(input_data_preprocessed)

# Output the prediction
print(json.dumps({"predicted_wait_time": predicted_wait_time[0]}))