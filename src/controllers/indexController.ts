import { Request, Response } from 'express';

// API calls
import getIdAndMolInfo from '../service/getIdAndMol';
import getHazardAndPictogramData from '../service/getHazardnPictogram';
import getPharmacologyData from '../service/getPharmacology';

const data: { [key: string]: {} } = {};

// TS interfaces
import { ExtractedData } from '../service/extractHazardnPictogram';
import urlHeadings from '../utils/urlHeadings';
import { IDMolResponse } from '../service/getIdAndMol';

// functions to extract needed data from the response
import extractInformation from '../service/extractHazardnPictogram';
import extractStringsFromResponse from '../service/extractString';

/**
 *
 * @param req
 * @param res
 * @returns
 */
async function handleApiRequest(req: Request, res: Response) {
  try {
    // const userInput: string = req.body.input;
    const userInput: string = 'salicylic acid';
    if (!userInput) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }
    // getting PubChem ID
    const IdAndMol: IDMolResponse = await getIdAndMolInfo(userInput);
    data['ID And Mol'] = IdAndMol.Properties;

    // sending API request for all the needed headings
    for (let heading of urlHeadings) {
      // getting element's safety and toxic Data
      let PharmacologyData = await getPharmacologyData(IdAndMol.Properties[0].CID, heading);
      // extracting element's safety and toxic Data
      data[heading] = extractStringsFromResponse(PharmacologyData);
    }

    // getting Hazard and Pictogram Data from PubChem DB
    const hazardAndPictogramData = await getHazardAndPictogramData(IdAndMol.Properties[0].CID);
    // extracting Hazard and Pictogram Data
    const extractHazardAndPictogramData: ExtractedData = extractInformation(hazardAndPictogramData);
    data['Hazard And Pictogram'] = extractHazardAndPictogramData;

    res.json(data);
  } catch (error: any) {
    console.error('Error handling API request:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default { handleApiRequest };
