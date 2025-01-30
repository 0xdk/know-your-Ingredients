import axios, { AxiosResponse } from 'axios';

async function getHazardAndPictogramData(id: Number) {
  try {
    const GHSinfo = axios.create({
      // https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/338/JSON/?response_type=display&heading=GHS+Classification
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
    });
    const searchResponse: AxiosResponse = await GHSinfo.get(
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
