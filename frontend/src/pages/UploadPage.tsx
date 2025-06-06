
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadDataset } from "@/utils/api";

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    diseaseName: '',
    description: '',
    csvFile: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setFormData(prev => ({ ...prev, csvFile: file }));
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.csvFile) {
      toast({
        title: "Missing File",
        description: "Please select a CSV file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const response = await uploadDataset(
        formData.csvFile,
        formData.diseaseName,
        formData.description
      );

      if (response.success) {
        setUploadSuccess(true);
        setUploadResult(response);
        toast({
          title: "Dataset Uploaded Successfully",
          description: `${formData.diseaseName} dataset has been processed and is ready for training.`,
          duration: 5000
        });
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload dataset. Make sure the backend server is running.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      diseaseName: '',
      description: '',
      csvFile: null
    });
    setUploadSuccess(false);
    setUploadResult(null);
  };

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
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload New Dataset</h1>
                <p className="text-gray-600">Add a new disease prediction model</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {uploadSuccess ? (
            // Success State
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-800">Upload Successful!</CardTitle>
                <CardDescription className="text-green-700">
                  Your dataset has been processed successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900">{formData.diseaseName}</h3>
                  <p className="text-gray-600 text-sm">{formData.description}</p>
                  {uploadResult?.dataset_info && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Rows: {uploadResult.dataset_info.rows}</p>
                      <p>Columns: {uploadResult.dataset_info.columns?.length}</p>
                    </div>
                  )}
                  <p className="text-green-600 text-sm mt-2">✓ Dataset uploaded successfully</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                  <ol className="text-left text-sm text-blue-700 list-decimal list-inside space-y-1">
                    <li>Train your model using the uploaded dataset</li>
                    <li>Save the trained model as a .sav file</li>
                    <li>Place the .sav file in the backend/models directory</li>
                    <li>Restart the backend server to load the new model</li>
                  </ol>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    Upload Another
                  </Button>
                  <Button onClick={() => navigate('/')} className="flex-1">
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Upload Form
            <>
              {/* Instructions Card */}
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Dataset Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Your CSV file should contain:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Feature columns (medical parameters)</li>
                      <li>Target column (outcome: 0 for negative, 1 for positive)</li>
                      <li>Column headers in the first row</li>
                      <li>Numeric values only (no missing data)</li>
                      <li>At least 10 samples for processing</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-xs font-mono text-gray-600">
                      Example: age,glucose,pressure,outcome<br/>
                      45,120,80,0<br/>
                      67,180,95,1
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Disease Dataset Information</CardTitle>
                  <CardDescription>
                    Provide details about your dataset and upload the CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="diseaseName">Disease Name *</Label>
                      <Input
                        id="diseaseName"
                        placeholder="e.g., Hypertension, Liver Disease"
                        value={formData.diseaseName}
                        onChange={(e) => setFormData(prev => ({ ...prev, diseaseName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the dataset and prediction purpose..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="csvFile">Dataset File (CSV) *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {formData.csvFile ? formData.csvFile.name : "Drop your CSV file here or click to browse"}
                          </p>
                          <Input
                            id="csvFile"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('csvFile')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isUploading || !formData.csvFile}
                      className="w-full"
                    >
                      {isUploading ? 'Uploading Dataset...' : 'Upload Dataset'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Warning Card */}
              <Card className="mt-8 bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">Important Notes</h4>
                      <ul className="text-amber-700 text-sm space-y-1">
                        <li>• Ensure your data is anonymized and complies with privacy regulations</li>
                        <li>• After uploading, you'll need to train a model and save it as .sav file</li>
                        <li>• Only upload data you have permission to use for machine learning</li>
                        <li>• Make sure the backend server is running to process uploads</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
