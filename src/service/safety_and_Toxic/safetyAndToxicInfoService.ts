import getSafetyAndToxicInfo from './getSafetyAndToxicInfo';
import extractStringsFromResponse from './extractSafetyAndToxicInfo';
import urlHeadings from '../../utils/urlHeadings';

/**
 * Fetches safety and toxicity information for a given PubChem ID.
 * Iterates through a predefined set of headings and collects relevant data.
 * @param pubChemID - The PubChem compound ID to fetch data for.
 * @returns A map of headings to their extracted data or `undefined` if not available.
 */
async function safetyAndToxicInfoService(pubChemID: Number) {
  const safetyAndToxicData: { [key: string]: {} | undefined } = {};
  try {
    // Fetch data for each heading
    const fetchPromises = urlHeadings.map(async (heading) => {
      const response = await getSafetyAndToxicInfo(pubChemID, heading);

      if (response) {
        safetyAndToxicData[heading] = extractStringsFromResponse(response);
      } else {
        console.warn(`No data found for heading: ${heading}`);
        safetyAndToxicData[heading] = undefined;
      }
    });

    // Waits for all fetches to complete
    // adding promise.all reduces the Response Time by ~3 seconds
    await Promise.all(fetchPromises);
    return safetyAndToxicData;
  } catch (error) {
    // Handle unexpected errors
    if (error instanceof Error) {
      console.error(
        `Error in safetyAndToxicInfoService for PubChem ID: ${pubChemID} - ${error.message}`
      );
    } else {
      console.error(`Unknown error occurred in safetyAndToxicInfoService:`, error);
    }

    throw new Error('An error occurred while fetching safety and toxicity data.');
  }
}

export default safetyAndToxicInfoService;
