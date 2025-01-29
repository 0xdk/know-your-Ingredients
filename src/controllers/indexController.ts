import { Request, Response } from 'express';
//API for PubChem ID and molecular info
import getIdAndMolInfo from '../service/getIdAndMol';
// Wikipedia API
import fetchWikiInfo from '../service/wiki';

// TS interfaces
import { ExtractedData } from '../service/hazard/extractHazardnPictogram';
import { IDMolResponse } from '../service/getIdAndMol';

// functions to extract needed data from the response
import extractInformation from '../service/extractHazardnPictogram';
import extractStringsFromResponse from '../service/extractString';

const data: { [key: string]: {} | null } = {};
/**
 *
 * @param req
 * @param res
 * @returns
 */
async function handleApiRequest(req: Request, res: Response) {
  try {
    const userInput: string = req.body.input;

    // getting element summery from WIKI
    const wikiData = await fetchWikiInfo(userInput);
    // getting PubChem ID
    const IdAndMol: IDMolResponse = await getIdAndMolInfo(userInput);
    data['ID And Mol'] = IdAndMol.Properties;

    // sending API request for all the needed headings
    for (let heading of urlHeadings) {
      // getting element's safety and toxic Data
      let PharmacologyData = await getPharmacologyData(IdAndMol.Properties[0].CID, heading);

      if (PharmacologyData == null) {
        //* refactor this
        data[heading] = null;
        continue;
      }
      // extracting element's safety and toxic Data
      data[heading] = extractStringsFromResponse(PharmacologyData);
    }

    // getting Hazard and Pictogram Data from PubChem DB
    const hazardAndPictogramData = await getHazardAndPictogramData(IdAndMol.Properties[0].CID);
    // extracting Hazard and Pictogram Dataas
    if (hazardAndPictogramData !== null) {
      const extractHazardAndPictogramData: ExtractedData =
        extractInformation(hazardAndPictogramData);
      data['Hazard And Pictogram'] = extractHazardAndPictogramData;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error handling API requests:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export default { handleApiRequest };
