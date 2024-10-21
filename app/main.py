from typing import Union
from fastapi import FastAPI
import sys
import json
import joblib
import pandas as pd

# Load the preprocessor and model
preprocessor = joblib.load('./public/preprocessor.pkl')
baseline_xgb_model = joblib.load('./public/xgb_model.pkl')

app = FastAPI()


@app.get("/")
def read_root():
    input_df = pd.DataFrame({
        'age': [25],
        'sex': ["male"],
        'ethnicity': ["Caucasian"],
        'triage_category': [3],
        'mode_of_arrival': ["ambulance"],
        'metropolitan_hospital_flag': [1],
        'affected_by_drugs_and_or_alcohol': [0],
        'self_harm_attendance': [0],
        'mental_health_attendance': [1],
        'doctors_available': [5],
        'beds_available': [20],
        'presentation_hour': [14],
        'presentation_day_of_week': [2],
        'is_weekend': [0],
        'doctor_to_patient_ratio': [0.1],
        'bed_to_patient_ratio': [0.2],
    })

    # Preprocess the input data
    input_data_preprocessed = preprocessor.transform(input_df)

    # Predict the wait time
    predicted_wait_time = baseline_xgb_model.predict(input_data_preprocessed)

    # Output the prediction
    print(json.dumps({"predicted_wait_time": predicted_wait_time[0]}))
    return {"Hello": "World"}
