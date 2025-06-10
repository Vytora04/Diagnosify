from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import pandas as pd
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MODELS_FOLDER = 'models'
ALLOWED_EXTENSIONS = {'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MODELS_FOLDER'] = MODELS_FOLDER

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load models
models = {}
scalers = {}
try:
    # Diabetes scaler
    diabetes_scaler_path = os.path.join(MODELS_FOLDER, 'scaler_diabetes.sav')
    if os.path.exists(diabetes_scaler_path):
        scalers['diabetes'] = joblib.load(open(diabetes_scaler_path, 'rb'))
        print("✅ Loaded scaler for diabetes")

    # Parkinson scaler
    parkinsons_scaler_path = os.path.join(MODELS_FOLDER, 'scaler_parkinson.sav')
    if os.path.exists(parkinsons_scaler_path):
        scalers['parkinsons'] = joblib.load(open(parkinsons_scaler_path, 'rb'))
        print("✅ Loaded scaler for parkinsons")

except Exception as e:
    print(f"Error loading scalers: {e}")
    
try:
    # Diabetes model
    diabetes_path = None
    for fname in ['diabetes_model.sav']:
        path = os.path.join(MODELS_FOLDER, fname)
        if os.path.exists(path):
            diabetes_path = path
            break
    if diabetes_path:
        models['diabetes'] = joblib.load(diabetes_path)

    # Heart model (support both names)
    heart_path = None
    for fname in ['heart_model.sav', 'heartDisease_model.sav']:
        path = os.path.join(MODELS_FOLDER, fname)
        if os.path.exists(path):
            heart_path = path
            break
    if heart_path:
        models['heart'] = joblib.load(heart_path)

    # Parkinson's model (support both names)
    parkinsons_path = None
    for fname in ['parkinsons_model.sav', 'parkinson_model.sav']:
        path = os.path.join(MODELS_FOLDER, fname)
        if os.path.exists(path):
            parkinsons_path = path
            break
    if parkinsons_path:
        models['parkinsons'] = joblib.load(parkinsons_path)
except Exception as e:
    print(f"Error loading models: {e}")

@app.route('/predict/<disease_type>', methods=['POST'])
def predict(disease_type):
    try:
        data = request.json
        
        if disease_type not in models:
            return jsonify({'error': f'Model for {disease_type} not found'}), 404
        
        # Extract features based on disease type
        if disease_type == 'diabetes':
            features = [
                float(data.get('pregnancies', 0)),
                float(data.get('glucose', 0)),
                float(data.get('bloodPressure', 0)),
                float(data.get('skinThickness', 0)),
                float(data.get('insulin', 0)),
                float(data.get('bmi', 0)),
                float(data.get('diabetesPedigree', 0)),
                float(data.get('age', 0))
            ]
        elif disease_type == 'heart':
            features = [
                float(data.get('age', 0)),
                float(data.get('sex', 0)),
                float(data.get('cp', 0)),
                float(data.get('trestbps', 0)),
                float(data.get('chol', 0)),
                float(data.get('fbs', 0)),
                float(data.get('restecg', 0)),
                float(data.get('thalach', 0)),
                float(data.get('exang', 0)),
                float(data.get('oldpeak', 0)),
                float(data.get('slope', 0)),
                float(data.get('ca', 0)),
                float(data.get('thal', 0))
            ]
        elif disease_type == 'parkinsons':
            features = [
                float(data.get('fo', 0)),
                float(data.get('fhi', 0)),
                float(data.get('flo', 0)),
                float(data.get('jitter_percent', 0)),
                float(data.get('jitter_abs', 0)),
                float(data.get('rap', 0)),
                float(data.get('ppq', 0)),
                float(data.get('ddp', 0)),
                float(data.get('shimmer', 0)),
                float(data.get('shimmer_db', 0)),
                float(data.get('apq3', 0)),
                float(data.get('apq5', 0)),
                float(data.get('apq', 0)),
                float(data.get('dda', 0)),
                float(data.get('nhr', 0)),
                float(data.get('hnr', 0)),
                float(data.get('rpde', 0)),
                float(data.get('dfa', 0)),
                float(data.get('spread1', 0)),
                float(data.get('spread2', 0)),
                float(data.get('d2', 0)),
                float(data.get('ppe', 0))
            ]
        
        # Make prediction
        features_array = np.array([features])

        # Apply scaler if exists
        if disease_type in scalers:
            features_array = scalers[disease_type].transform(features_array)

        # Prediction and probability
        prediction = models[disease_type].predict(features_array)[0]
        probability = models[disease_type].predict_proba(features_array)[0] if hasattr(models[disease_type], 'predict_proba') else None

        result = 'Positive' if prediction == 1 else 'Negative'
        
        response = {
            'prediction': result,
            'confidence': float(max(probability)) if probability is not None else None
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/upload-dataset', methods=['POST'])
def upload_dataset():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        disease_name = request.form.get('diseaseName')
        description = request.form.get('description')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Process the CSV file
            df = pd.read_csv(filepath)
            
            # Basic validation
            if df.empty:
                return jsonify({'error': 'Empty CSV file'}), 400
            
            if len(df) < 10:
                return jsonify({'error': 'Dataset too small (minimum 10 samples required)'}), 400
            
            # Save dataset info
            dataset_info = {
                'name': disease_name,
                'description': description,
                'filename': filename,
                'rows': len(df),
                'columns': list(df.columns)
            }
            
            return jsonify({
                'success': True,
                'message': 'Dataset uploaded successfully',
                'dataset_info': dataset_info
            })
        
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'loaded_models': list(models.keys())
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
