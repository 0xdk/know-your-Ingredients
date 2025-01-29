import getHazardAndPictogramData from './getHazardnPictogram';
import extractInformation from './extractHazardnPictogram';

/**
 * Fetches and extracts hazard and pictogram information for a given PubChem ID.
 * @param pubChemID - The PubChem compound ID for which to fetch hazard and pictogram data.
 * @returns The extracted hazard and pictogram data or `undefined` if not available.
 */
async function hazardService(pubChemID: Number) {
  try {
    let hazardAndPictogramData = await getHazardAndPictogramData(pubChemID);
    // extracting Hazard and Pictogram Data
    if (hazardAndPictogramData) {
      return extractInformation(hazardAndPictogramData);
    }
    return undefined;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching hazard data for PubChem ID: ${pubChemID} - ${error.message}`);
    } else {
      console.error(
        `Unknown error occurred while processing hazard data for PubChem ID: ${pubChemID}`,
        error
      );
    }
    throw new Error('An error occurred in hazardService. See logs for details.');
  }
}

export default hazardService;
