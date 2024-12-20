import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

async function getIdAndMolInfo(elementName: string): Promise<Number> {
  const getBasicInfo = axios.create({
    baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug//compound/name/`,
  });

  const basicInfo: AxiosResponse = await getBasicInfo.get(
    `${elementName}/property/MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`
  );
  console.log('from function');
  console.log(basicInfo.data.PropertyTable.Properties[0].CID);
  return basicInfo.data.PropertyTable.Properties[0].CID;
}
export default getIdAndMolInfo;
