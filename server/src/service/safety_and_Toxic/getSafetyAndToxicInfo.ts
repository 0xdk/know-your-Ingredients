import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { PubChemResponse } from './extractSafetyAndToxicInfo';

/**
 * Fetches pharmacology data for a given PubChem compound ID and heading.
 *
 * @param pubChemID - The PubChem compound ID for which to fetch pharmacology data.
 * @param heading - The specific heading/category of pharmacology data to retrieve.
 * @param URL - Axios instance configured with the base URL for PubChem API requests.
 *
 * @returns The fetched pharmacology data as a `PubChemResponse` object, or `null` if no data is found.
 *
 */
async function getPharmacologyData(
  pubChemID: Number,
  heading: string,
  URL: AxiosInstance
): Promise<PubChemResponse | null> {
  try {
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
    if (axios.isAxiosError(error)) {
      // Handle 404 Not Found specifically
      if (error.response?.status === 404) {
        console.warn(`No data found for PubChem ID: ${pubChemID}, Heading: ${heading}`);
        return null;
      }
      // Other Axios errors
      console.error('Axios Error:', error.response?.data || error.message);
    }
    // Throwing the error allows it to be handled by the caller
    throw new Error(`Failed to fetch data for PubChem ID: ${pubChemID}, Heading: ${heading}`);
  }
}

export default getPharmacologyData;
