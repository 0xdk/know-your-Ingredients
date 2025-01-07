import getHazardAndPictogramData from './getHazardnPictogram';
import extractInformation from './extractHazardnPictogram';

async function hazardService(pubChemID: Number) {
  let hazardAndPictogramData = await getHazardAndPictogramData(pubChemID);
  // extracting Hazard and Pictogram Data
  if (hazardAndPictogramData) {
    return extractInformation(hazardAndPictogramData);
  } else {
    return null;
  }
}

export default hazardService;
