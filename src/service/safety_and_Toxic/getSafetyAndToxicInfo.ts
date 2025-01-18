import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { PubChemResponse } from './extractSafetyAndToxicInfo';

async function getPharmacologyData(
  pubChemID: Number,
  heading: string
): Promise<PubChemResponse | null> {
  try {
    const URL = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
      timeout: 10000,
    });
    const response: AxiosResponse = await URL.get(
      `${pubChemID}/JSON/?response_type=display&heading=${heading}`
    );

    if (response.data) {
      return response.data;
    } else {
      console.warn(`Empty data received for PubChem ID: ${pubChemID}, Heading: ${heading}`);
      return null;
    }
  } catch (error: any) {
    // Handle 404 Not Found specifically
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`No data found for PubChem ID: ${pubChemID}, Heading: ${heading}`);
        return null;
      }
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      // Handle unexpected errors
      console.error('Unknown Error getting Safety and Toxic info:', error);
    }

    // Throwing the error allows it to be handled by the caller
    throw new Error(`Failed to fetch data for PubChem ID: ${pubChemID}, Heading: ${heading}`);
  }
}

export default getPharmacologyData;
