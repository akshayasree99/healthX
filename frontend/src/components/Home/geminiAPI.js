'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA9jgY9UGGB2Z3lmyB8nQh3nzDsQLqe9CY';
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * @typedef {Object} MedicalCondition
 * @property {string} disease
 * @property {string[]} preventionMethods
 * @property {string[]} homeRemedies
 * @property {string} doctor
 * @property {string[]} foodToAvoid
 * @property {string[]} foodToEat
 */

/**
 * Detect medical conditions from an image
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<{conditions: MedicalCondition[], rawResponse: string}>}
 */
export async function detectMedicalConditions(base64Image) {
  console.log('Starting medical condition analysis...');
  try {
    if (!base64Image) {
      throw new Error('No image data provided');
    }

    const base64Data = base64Image.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Initialized Gemini model');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    console.log('Sending image to API...', { imageSize: base64Data.length });
    const prompt = `Analyze this image and identify any visible medical conditions, infections, cuts, injuries, or health concerns. Look for:

1. Skin Conditions:
   - Rashes, redness, inflammation
   - Unusual marks, moles, or lesions
   - Discoloration or abnormal skin texture
   - Swelling or edema

2. Wounds and Injuries:
   - Cuts, lacerations, or abrasions
   - Bruises or contusions
   - Burns (first, second, or third degree)
   - Fractures or potential broken bones

3. Infections:
   - Signs of infection (redness, swelling, warmth)
   - Pus or discharge
   - Infected wounds
   - Fungal infections

4. Other Medical Concerns:
   - Allergic reactions
   - Signs of inflammation or joint problems
   - Visible deformities
   - Any other observable health issues

For each identified condition, return a JSON object in this exact format:

{
  "conditions": [
    {
      "disease": "Name of the potential condition/injury",
      "preventionMethods": ["Method 1", "Method 2", "Method 3"],
      "homeRemedies": ["Remedy 1", "Remedy 2", "Remedy 3"],
      "doctor": "Type of specialist to consult",
      "foodToAvoid": ["Food 1", "Food 2", "Food 3"],
      "foodToEat": ["Food 1", "Food 2", "Food 3"]
    }
  ]
}

If multiple conditions are detected, include multiple objects in the array. If no conditions are detected, return an empty array.

IMPORTANT: Focus only on visually identifiable conditions. Do NOT diagnose internal medical conditions that cannot be seen in the image. Include a disclaimer that this is not a medical diagnosis.`;

    try {
      const result = await model.generateContent([prompt, imagePart]);

      const response = await result.response;
      const text = response.text();
      console.log('Raw API Response:', text);

      // Try to extract JSON from the response, handling potential code blocks
      let jsonStr = text;

      // First try to extract content from code blocks if present
      const codeBlockMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
        console.log('Extracted JSON from code block:', jsonStr);
      } else {
        // If no code block, try to find raw JSON
        const jsonMatch = text.match(/\{[^]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
          console.log('Extracted raw JSON:', jsonStr);
        }
      }

      try {
        const parsed = JSON.parse(jsonStr);
        return {
          conditions: parsed.conditions || [],
          rawResponse: text,
        };
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Failed to parse API response');
      }
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in detectMedicalConditions:', error);
    throw error;
  }
}