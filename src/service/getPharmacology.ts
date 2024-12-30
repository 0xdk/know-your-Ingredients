import axios, { AxiosResponse } from 'axios';
import { PubChemResponse } from './extractString';

async function getPharmacologyData(id: Number, heading: string): Promise<PubChemResponse> {
  try {
    const URL = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
    });

    const response: AxiosResponse = await URL.get(
      // `${id}/JSON/?response_type=display&heading=Pharmacology` (og link)
      // `${id}/JSON/?response_type=display&heading=Hazards%20Summary` (first test)
      // `${id}/JSON/?response_type=display&heading=Effects%20of%20Long%20Term%20Exposure` (second test)
      // `${id}/JSON/?response_type=display&heading=Human%20Toxicity%20Excerpts` (third test)
      // `${id}/JSON/?response_type=display&heading=Antidote%20and%20Emergency%20Treatment` (forth test)
      // `${id}/JSON/?response_type=display&heading=Storage%20Conditions` (fifth test)
      `${id}/JSON/?response_type=display&heading=${heading}`
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
