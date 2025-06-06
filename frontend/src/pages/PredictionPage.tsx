import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Activity, Heart, Brain, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictDisease } from "@/utils/api";

const PredictionPage = () => {
  const { diseaseType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const diseaseConfigs = {
    diabetes: {
      title: "Diabetes Prediction",
      icon: Activity,
      iconColor: "text-blue-600",
      fields: [
        { name: "pregnancies", label: "Number of Pregnancies", type: "number", placeholder: "0-17" },
        { name: "glucose", label: "Glucose Level (mg/dL)", type: "number", placeholder: "0-200" },
        { name: "bloodPressure", label: "Blood Pressure (mm Hg)", type: "number", placeholder: "0-122" },
        { name: "skinThickness", label: "Skin Thickness (mm)", type: "number", placeholder: "0-100" },
        { name: "insulin", label: "Insulin Level (mu U/mL)", type: "number", placeholder: "0-846" },
        { name: "bmi", label: "BMI", type: "number", step: "0.1", placeholder: "0.0-67.1" },
        { name: "diabetesPedigree", label: "Diabetes Pedigree Function", type: "number", step: "0.001", placeholder: "0.078-2.42" },
        { name: "age", label: "Age (years)", type: "number", placeholder: "21-81" }
      ]
    },
    heart: {
      title: "Heart Disease Prediction",
      icon: Heart,
      iconColor: "text-red-600", 
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "29-77" },
        { name: "sex", label: "Sex (1=Male, 0=Female)", type: "number", placeholder: "0 or 1" },
        { name: "cp", label: "Chest Pain Type (0-3)", type: "number", placeholder: "0-3" },
        { name: "trestbps", label: "Resting Blood Pressure (mm Hg)", type: "number", placeholder: "94-200" },
        { name: "chol", label: "Cholesterol (mg/dL)", type: "number", placeholder: "126-564" },
        { name: "fbs", label: "Fasting Blood Sugar > 120 mg/dl (1=Yes, 0=No)", type: "number", placeholder: "0 or 1" },
        { name: "restecg", label: "Resting ECG Results (0-2)", type: "number", placeholder: "0-2" },
        { name: "thalach", label: "Maximum Heart Rate Achieved", type: "number", placeholder: "71-202" },
        { name: "exang", label: "Exercise Induced Angina (1=Yes, 0=No)", type: "number", placeholder: "0 or 1" },
        { name: "oldpeak", label: "ST Depression", type: "number", step: "0.1", placeholder: "0.0-6.2" },
        { name: "slope", label: "Slope of Peak Exercise ST Segment (0-2)", type: "number", placeholder: "0-2" },
        { name: "ca", label: "Number of Major Vessels (0-4)", type: "number", placeholder: "0-4" },
        { name: "thal", label: "Thalassemia (0=Normal, 1=Fixed Defect, 2=Reversable Defect)", type: "number", placeholder: "0-2" }
      ]
    },
    parkinsons: {
      title: "Parkinson's Disease Prediction", 
      icon: Brain,
      iconColor: "text-purple-600",
      fields: [
        { name: "fo", label: "Average Vocal Fundamental Frequency", type: "number", step: "0.001", placeholder: "88.333-260.105" },
        { name: "fhi", label: "Maximum Vocal Fundamental Frequency", type: "number", step: "0.001", placeholder: "102.145-592.030" },
        { name: "flo", label: "Minimum Vocal Fundamental Frequency", type: "number", step: "0.001", placeholder: "65.476-239.170" },
        { name: "jitter_percent", label: "Jitter Percentage", type: "number", step: "0.00001", placeholder: "0.00168-0.03316" },
        { name: "jitter_abs", label: "Absolute Jitter", type: "number", step: "0.000001", placeholder: "0.000007-0.000260" },
        { name: "rap", label: "Relative Amplitude Perturbation", type: "number", step: "0.00001", placeholder: "0.00068-0.02144" },
        { name: "ppq", label: "Five-point Period Perturbation Quotient", type: "number", step: "0.00001", placeholder: "0.00092-0.01958" },
        { name: "ddp", label: "Average Absolute Difference of Differences", type: "number", step: "0.00001", placeholder: "0.00204-0.06433" },
        { name: "shimmer", label: "Shimmer", type: "number", step: "0.00001", placeholder: "0.00954-0.11908" },
        { name: "shimmer_db", label: "Shimmer in dB", type: "number", step: "0.001", placeholder: "0.085-1.302" },
        { name: "apq3", label: "Three-point Amplitude Perturbation Quotient", type: "number", step: "0.00001", placeholder: "0.00455-0.05647" },
        { name: "apq5", label: "Five-point Amplitude Perturbation Quotient", type: "number", step: "0.00001", placeholder: "0.00757-0.07940" },
        { name: "apq", label: "Amplitude Perturbation Quotient", type: "number", step: "0.00001", placeholder: "0.00719-0.13778" },
        { name: "dda", label: "Average Absolute Differences between Consecutive Differences", type: "number", step: "0.00001", placeholder: "0.01364-0.16926" },
        { name: "nhr", label: "Noise-to-Harmonics Ratio", type: "number", step: "0.00001", placeholder: "0.00065-0.75886" },
        { name: "hnr", label: "Harmonics-to-Noise Ratio", type: "number", step: "0.001", placeholder: "8.441-33.047" },
        { name: "rpde", label: "Recurrence Period Density Entropy", type: "number", step: "0.000001", placeholder: "0.256570-0.685151" },
        { name: "dfa", label: "Detrended Fluctuation Analysis", type: "number", step: "0.000001", placeholder: "0.574282-0.825288" },
        { name: "spread1", label: "Fundamental Frequency Variation", type: "number", step: "0.000001", placeholder: "-7.964984--2.434031" },
        { name: "spread2", label: "Fundamental Frequency Variation", type: "number", step: "0.000001", placeholder: "0.006274-0.450493" },
        { name: "d2", label: "Correlation Dimension", type: "number", step: "0.000001", placeholder: "1.423287-3.671155" },
        { name: "ppe", label: "Pitch Period Entropy", type: "number", step: "0.000001", placeholder: "0.044539-0.527367" }
      ]
    }
  };

  const config = diseaseConfigs[diseaseType as keyof typeof diseaseConfigs];

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Disease Type Not Found</CardTitle>
            <CardDescription>The specified disease type is not supported.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const processedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = parseFloat(formData[key]) || 0;
        return acc;
      }, {} as Record<string, number>);

      const response = await predictDisease(diseaseType!, processedData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.prediction);
      setConfidence(response.confidence || null);
      
      toast({
        title: "Prediction Complete",
        description: `Result: ${response.prediction} ${response.confidence ? `(${(response.confidence * 100).toFixed(1)}% confidence)` : ''}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to connect to backend. Make sure the server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-gray-600">Enter your medical data for prediction</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Result Card */}
          {result && (
            <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {result === 'Positive' ? (
                    <AlertCircle className="h-12 w-12 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  Prediction Result: {result}
                  {confidence && (
                    <span className="text-lg text-gray-600 block mt-1">
                      Confidence: {(confidence * 100).toFixed(1)}%
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-lg">
                  {result === 'Positive' 
                    ? "The model indicates potential risk. Please consult with a healthcare professional."
                    : "The model indicates low risk. Continue maintaining a healthy lifestyle."
                  }
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                Medical Data Input
              </CardTitle>
              <CardDescription>
                Please fill in all the required medical parameters for accurate prediction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {config.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        step={field.step}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Analyzing...' : 'Predict'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setFormData({});
                      setResult(null);
                      setConfidence(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Medical Disclaimer</h4>
                  <p className="text-yellow-700 text-sm">
                    This prediction tool is for educational and informational purposes only. 
                    It should not be used as a substitute for professional medical advice, 
                    diagnosis, or treatment. Always consult with qualified healthcare providers 
                    for medical decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PredictionPage;
