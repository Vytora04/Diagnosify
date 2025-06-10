// const API_BASE_URL = 'http://localhost:5000'; // For local run
const API_BASE_URL = import.meta.env.VITE_API_URL; // For online run

export interface PredictionRequest {
  [key: string]: string | number;
}

export interface PredictionResponse {
  prediction: 'Positive' | 'Negative';
  confidence?: number;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  dataset_info?: {
    name: string;
    description: string;
    filename: string;
    rows: number;
    columns: string[];
  };
  error?: string;
}

export const predictDisease = async (
  diseaseType: string,
  data: PredictionRequest
): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/${diseaseType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction API error:', error);
    throw error;
  }
};

export const uploadDataset = async (
  file: File,
  diseaseName: string,
  description: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('diseaseName', diseaseName);
    formData.append('description', description);

    const response = await fetch(`${API_BASE_URL}/upload-dataset`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload API error:', error);
    throw error;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { status: 'offline', error: error.message };
  }
};
