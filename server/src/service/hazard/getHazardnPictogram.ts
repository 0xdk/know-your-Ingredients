import axios, { AxiosResponse, AxiosInstance } from 'axios';

/**
 *Fetches Hazard and pictogram data from PubChem DB for given ID
 *
 * @param id The PubChem compound ID to fetch info from PubChem API
 * @param URL Base URL with Axios instance configured
 * @returns the fetched hazard and pictogram data or return null if no data found
 */
async function getHazardAndPictogramData(id: Number, URL: AxiosInstance) {
  try {
    const searchResponse: AxiosResponse = await URL.get(
      `${id}/JSON/?response_type=display&heading=GHS+Classification`
    );
    if (!searchResponse.data) {
      return null;
    }
    return searchResponse.data.Record.Section;
  } catch (error: any) {
    // axios error
    if (axios.isAxiosError(error)) {
      console.error('API Error hazard and pictogram:', error.response?.data || error.message);
      return null;
    }
    console.error('Unknown Error:', error.message);
    throw new Error('An unknown error occurred while fetching data');
  }
}

export default getHazardAndPictogramData;
