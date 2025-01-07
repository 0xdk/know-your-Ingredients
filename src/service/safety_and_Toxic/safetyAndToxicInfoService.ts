import getSafetyAndToxicInfo from './getSafetyAndToxicInfo';
import extractStringsFromResponse from './extractSafetyAndToxicInfo';
import urlHeadings from '../../utils/urlHeadings';
const safetyAndToxicData: { [key: string]: {} | null } = {};

async function safetyAndToxicInfoService(pubChemID: Number) {
  // sending API request for all the needed headings
  for (let heading of urlHeadings) {
    // getting element's safety and toxic Data from PubChem DB
    let PharmacologyData = await getSafetyAndToxicInfo(pubChemID, heading);
    if (PharmacologyData) {
      safetyAndToxicData[heading] = extractStringsFromResponse(PharmacologyData);
    } else {
      safetyAndToxicData[heading] = null;
    }
  }
  return safetyAndToxicData;
}

export default safetyAndToxicInfoService;
