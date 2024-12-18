import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

async function getHazardAndPictogramData(id: Number) {
  const GHSinfo = axios.create({
    // https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/338/JSON/?response_type=display&heading=GHS+Classification
    baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
  });

  const searchResponse: AxiosResponse = await GHSinfo.get(
    `${id}/JSON/?response_type=display&heading=GHS+Classification`
  );

  return searchResponse;
}

export default getHazardAndPictogramData;
