
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Brain, Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const diseaseCategories = [
    {
      id: "diabetes",
      title: "Diabetes Prediction",
      description: "Predict diabetes risk based on medical indicators",
      icon: Activity,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      id: "heart",
      title: "Heart Disease Prediction", 
      description: "Assess cardiovascular disease risk factors",
      icon: Heart,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      iconColor: "text-red-600"
    },
    {
      id: "parkinsons",
      title: "Parkinson's Disease",
      description: "Analyze symptoms for Parkinson's indicators",
      icon: Brain,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100", 
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Diagnosify</h1>
              <p className="text-gray-600 mt-1">AI-Powered Disease Prediction Platform</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/upload')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Dataset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Disease Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a disease category to begin your health assessment. Our AI models provide 
            accurate predictions based on validated medical research.
          </p>
        </div>

        {/* Disease Category Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {diseaseCategories.map((disease) => {
            const IconComponent = disease.icon;
            return (
              <Card 
                key={disease.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${disease.color}`}
                onClick={() => navigate(`/predict/${disease.id}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-white shadow-sm">
                      <IconComponent className={`h-8 w-8 ${disease.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{disease.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {disease.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="default">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Disease Category */}
        <div className="flex justify-center">
          <Card className="bg-gray-50 border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-all duration-200 w-full max-w-md">
            <CardHeader className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white shadow-sm">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <CardTitle className="text-xl text-gray-700">Add New Disease</CardTitle>
              <CardDescription className="text-gray-500">
                Upload your own dataset to create a new prediction model
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-8">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/upload')}
              >
                Upload Dataset
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Diagnosify?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">AI-Powered</h4>
              <p className="text-gray-600">Advanced machine learning models trained on medical datasets</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Accurate Results</h4>
              <p className="text-gray-600">High precision predictions based on validated research</p>
            </div>
            <div>
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Easy to Use</h4>
              <p className="text-gray-600">Simple forms and clear results for better healthcare decisions</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">⚠️ This tool is for educational purposes only and should not replace professional medical advice.</p>
            <p>&copy; 2025 Diagnosify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
