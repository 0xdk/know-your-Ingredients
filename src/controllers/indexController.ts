import { Request, Response } from 'express';
//API for PubChem ID and molecular info
import getIdAndMolInfo from '../service/getIdAndMol';
// Wikipedia API
import fetchWikiInfo from '../service/wiki';
// helper functions
import safetyAndToxicInfoService from '../service/safety_and_Toxic/safetyAndToxicInfoService';
import hazardService from '../service/hazard/hazardService';
// TS interfaces
import { ExtractedData } from '../service/hazard/extractHazardnPictogram';
import { IDMolResponse } from '../service/getIdAndMol';

interface ApiResponse {
  wikiData: string | null;
  IdAndMol: Record<string, any> | null;
  hazardAndPictogram: ExtractedData | null;
  safetyAndToxicData: {} | null;
}
const data: ApiResponse = {
  wikiData: null,
  IdAndMol: null,
  hazardAndPictogram: null,
  safetyAndToxicData: null,
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
async function handleApiRequest(req: Request, res: Response) {
  try {
    // const userInput: string = req.body.input;
    const userInput: string = 'selenium';
    if (!userInput) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }
    // getting element summery from WIKI
    data.wikiData = await fetchWikiInfo(userInput);
    // getting PubChem ID
    const IdAndMol: IDMolResponse | null = await getIdAndMolInfo(userInput);

    if (IdAndMol) {
      data.IdAndMol = IdAndMol.Properties;
      const pubChemID = IdAndMol.Properties[0].CID;
      data.safetyAndToxicData = await safetyAndToxicInfoService(pubChemID);
      data.hazardAndPictogram = await hazardService(pubChemID);
    }
    // No data found or users must entered a wrong or miss spelled name
    if (data.wikiData === null && data.IdAndMol === null) {
      res.status(404).json({
        error:
          'No result found for the provided input. Please check the spelling or try another name.',
      });
      return;
    }
    res.json(data);
  } catch (error: any) {
    console.error('Error handling API requests:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export default { handleApiRequest };
