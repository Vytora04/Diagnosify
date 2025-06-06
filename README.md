# Diagnosify - AI Disease Prediction Platform

A modern web application for disease prediction using machine learning models. The platform supports multiple disease categories and allows users to upload custom datasets for training new prediction models.

## Features

- **Multiple Disease Predictions**: Diabetes, Heart Disease, and Parkinson's Disease
- **Real Model Integration**: Uses your trained .sav model files
- **Dataset Upload**: Upload CSV files to create new disease prediction models
- **Responsive Design**: Modern UI optimized for desktop and mobile
- **RESTful API**: Flask backend with proper error handling

## Project Structure

```
diagnosify/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── run.py              # Server startup script
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # Place your .sav model files here
│   │   ├── README.md       # Model requirements and naming convention
│   │   ├── diabetes_model.sav      # (Your diabetes model)
│   │   ├── heart_model.sav         # (Your heart disease model)
│   │   └── parkinsons_model.sav    # (Your Parkinson's model)
│   └── uploads/            # Uploaded CSV files storage
└── frontend/               # React frontend
    ├── src/
    ├── public/
    ├── pages/
    ├── utils/
    └── components/
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add your trained models:**
   - Place your .sav model files in the `backend/models/` directory
   - Follow the naming convention: `diabetes_model.sav`, `heart_model.sav`, `parkinsons_model.sav`
   - See `backend/models/README.md` for detailed requirements

4. **Start the backend server:**
   ```bash
   python run.py
   ```
   
   The backend will be available at `http://localhost:5000`

### Frontend Setup

The frontend is already configured. Make sure the backend is running before testing predictions.

## Model Requirements

Your models should be scikit-learn models saved using joblib:

```python
import joblib
from sklearn.ensemble import RandomForestClassifier

# Train your model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'diabetes_model.sav')
```

### Expected Input Features

**Diabetes Model (8 features):**
- pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigree, age

**Heart Disease Model (13 features):**
- age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal

**Parkinson's Model (22 features):**
- fo, fhi, flo, jitter_percent, jitter_abs, rap, ppq, ddp, shimmer, shimmer_db, apq3, apq5, apq, dda, nhr, hnr, rpde, dfa, spread1, spread2, d2, ppe

## API Endpoints

- `GET /health` - Check backend status and loaded models
- `POST /predict/<disease_type>` - Make predictions
- `POST /upload-dataset` - Upload new datasets

## Usage

1. **Start the backend server** following the setup instructions above
2. **Access the web app** in your browser
3. **Select a disease category** from the homepage
4. **Fill in the medical parameters** in the prediction form
5. **Get instant predictions** with confidence scores
6. **Upload new datasets** via the upload page for custom disease categories

## Security Notes

- Models are loaded securely using joblib
- File uploads are validated and stored safely
- CORS is properly configured for frontend-backend communication
- Input validation prevents malicious data injection

## Adding New Disease Categories

1. Upload a CSV dataset via the web interface
2. Train a scikit-learn model using the uploaded data
3. Save the model as a .sav file in the `backend/models/` directory
4. Restart the backend server to load the new model
5. The new disease category will be automatically available

## Medical Disclaimer

This tool is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
