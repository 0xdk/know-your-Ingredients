import axios, { AxiosResponse } from 'axios';

export interface IDMolResponse {
  Properties: {
    CID: number;
    MolecularFormula: string;
    MolecularWeight: number;
    CanonicalSMILES: string;
  }[];
}

async function getIdAndMolInfo(elementName: string): Promise<IDMolResponse> {
  try {
    const getCID = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug//compound/name/`,
    });

    const response: AxiosResponse = await getCID.get(
      `${elementName}/property/MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`
    );
    // console.log(response.data.PropertyTable.Properties[0]);
    return response.data.PropertyTable;
    // return response.data;
  } catch (error: any) {
    // axios error
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(`PubChem API Error: ${error.message}`);
    }
    // not axios error
    console.error('Error getting ID:', error.message);
    throw new Error(`Failed to get compound information: ${error.message}`);
  }
}
export default getIdAndMolInfo;
