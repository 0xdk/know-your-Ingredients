import axios, { AxiosResponse } from 'axios';
import { PubChemResponse } from './extractPharmacology';

async function getPharmacologyData(id: Number): Promise<PubChemResponse> {
  try {
    const URL = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
    });

    const response: AxiosResponse = await URL.get(
      `${id}/JSON/?response_type=display&heading=Pharmacology`
    );

    if (!response.data) {
      throw new Error('No Pharmacology data in the response');
    }
    // console.log(response.data.Record.Section[0].Section[0].Information);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(`PubChem API Error: ${error.message}`);
    }
    // Handle the case where we threw our own error about missing data
    if (error instanceof Error) {
      console.error('Data Error:', error.message);
      throw error; // Re-throw the same error
    }
    // Handle truly unknown errors
    console.error('Unknown Error:', error);
    throw new Error('An unknown error occurred while fetching data');
  }
}

export default getPharmacologyData;
