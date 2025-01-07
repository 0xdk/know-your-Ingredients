import axios, { AxiosResponse } from 'axios';
import { PubChemResponse } from './extractSafetyAndToxicInfo';

async function getPharmacologyData(
  pubChemID: Number,
  heading: string
): Promise<PubChemResponse | null> {
  try {
    const URL = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
    });
    const response: AxiosResponse = await URL.get(
      `${pubChemID}/JSON/?response_type=display&heading=${heading}`
    );

    // Return the data if it's valid
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      // Handle 404 Not Found specifically
      if (error.response?.status === 404) {
        console.error(`No data found for heading: ${heading}`);
        return null; // Return null or handle it appropriately
      }
      // Handle other Axios errors
      throw new Error(`PubChem API Error: ${error.message}`);
    }
    console.error('Unknown Error:', error);
    throw new Error('An unknown error occurred while fetching data');
  }
}

export default getPharmacologyData;
