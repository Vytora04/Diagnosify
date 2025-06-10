
# Models Directory

Place your trained .sav model files in this directory with the following naming convention:

- `diabetes_model.sav` - For diabetes prediction
- `heart_model.sav` - For heart disease prediction  
- `parkinsons_model.sav` - For Parkinson's disease prediction

## Model Requirements

Your models should be trained scikit-learn models saved using joblib:

```python
import joblib
joblib.dump(model, 'diabetes_model.sav')
```

## Expected Input Features

### Diabetes Model (8 features):
1. pregnancies
2. glucose
3. bloodPressure
4. skinThickness
5. insulin
6. bmi
7. diabetesPedigree
8. age

### Heart Disease Model (13 features):
1. age
2. sex
3. cp
4. trestbps
5. chol
6. fbs
7. restecg
8. thalach
9. exang
10. oldpeak
11. slope
12. ca
13. thal

### Parkinson's Model (22 features):
1. fo
2. fhi
3. flo
4. jitter_percent
5. jitter_abs
6. rap
7. ppq
8. ddp
9. shimmer
10. shimmer_db
11. apq3
12. apq5
13. apq
14. dda
15. nhr
16. hnr
17. rpde
18. dfa
19. spread1
20. spread2
21. d2
22. ppe

All models should output 0 (negative) or 1 (positive) predictions.
