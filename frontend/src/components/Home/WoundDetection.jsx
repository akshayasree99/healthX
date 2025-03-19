'use client';

import { useState, useRef } from 'react';
import { detectMedicalConditions } from './geminiAPI'; // Assuming you've saved the previous code as actions.js/ts

export default function WoundDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setResults(null);
    setError(null);

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      
      reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
          // Call the detection function
          const response = await detectMedicalConditions(base64Image);
          setResults(response);
        } catch (err) {
          console.error('Error analyzing image:', err);
          setError('Failed to analyze image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setIsLoading(false);
      };
    } catch (err) {
      console.error('Error in submission:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Medical Condition Detection</h1>
      
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            ref={fileInputRef}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {previewUrl && (
          <div className="mb-4">
            <p className="block text-gray-700 text-sm font-bold mb-2">Preview</p>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !image}
            className={`${
              isLoading || !image
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Display */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Analyzing image...</p>
        </div>
      )}

      {results && results.conditions && results.conditions.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <div className="space-y-6">
            {results.conditions.map((condition, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {condition.disease}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Prevention Methods</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {condition.preventionMethods.map((method, i) => (
                        <li key={i}>{method}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Home Remedies</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {condition.homeRemedies.map((remedy, i) => (
                        <li key={i}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-1">Specialist to Consult</h4>
                  <p className="text-gray-600">{condition.doctor}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Foods to Avoid</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {condition.foodToAvoid.map((food, i) => (
                        <li key={i}>{food}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Foods to Eat</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {condition.foodToEat.map((food, i) => (
                        <li key={i}>{food}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : results && results.conditions && results.conditions.length === 0 ? (
        <div className="mt-8 text-center p-8 bg-green-50 rounded-lg">
          <p className="text-lg font-medium text-green-800">No medical conditions detected in the image.</p>
          <p className="text-sm text-green-600 mt-2">
            Remember that this tool has limitations and may not detect all conditions. If you're concerned about your health, please consult a healthcare professional.
          </p>
        </div>
      ) : null}
    </div>
  );
}