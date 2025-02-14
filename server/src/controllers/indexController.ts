import { Request, Response } from 'express';
import axios from 'axios';
//API for PubChem ID and molecular info
import getIdAndMolInfo from '../service/getIdAndMol';
// Wikipedia API
import fetchWikiInfo from '../service/wiki';
// Open AI
import fetchElementInfoFromOpenAI from '../service/openAi';
// helper functions
import safetyAndToxicInfoService from '../service/safety_and_Toxic/safetyAndToxicInfoService';
import hazardService from '../service/hazard/hazardService';
// TS interfaces
import { ExtractedData } from '../service/hazard/extractHazardnPictogram';
import { IDMolResponse } from '../service/getIdAndMol';

interface ApiResponse {
  wikiData: string | undefined;
  IdAndMol: Record<string, any> | null;
  hazardsAndPictograms: ExtractedData | undefined;
  safetyAndToxicData: {} | undefined;
  openAiResponse: string | null | undefined;
}
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
    const IdAndMolResponse: IDMolResponse | null = await getIdAndMolInfo(userInput);
    const openAiResponse = await fetchElementInfoFromOpenAI(userInput);

    let IdAndMol;
    let safetyAndToxicData;
    let hazardsAndPictograms;
    // Base URL for PumChem API request
    const URL = axios.create({
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
      timeout: 10000,
    });

    if (IdAndMolResponse) {
      IdAndMol = IdAndMolResponse.Properties;
      const pubChemID = IdAndMolResponse.Properties[0].CID;
      // getting safety and toxicity data from PubChem DB with pubChem ID
      safetyAndToxicData = await safetyAndToxicInfoService(pubChemID, URL);
      // getting hazard and pictograms from PubChem DB

      hazardsAndPictograms = await hazardService(pubChemID, URL);
    } else {
      IdAndMol = null;
    }
    // No data found or users must entered a wrong or miss spelled name
    if (wikiData === undefined && IdAndMol === null) {
      res.status(404).json({
        error:
          'No result found for the provided input. Please check the spelling or try another name.',
      });
      return;
    }
    const data: ApiResponse = {
      wikiData,
      IdAndMol,
      hazardsAndPictograms,
      safetyAndToxicData,
      openAiResponse,
    };
    res.json(data);
  } catch (error: any) {
    console.error('Error handling API requests:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export default { handleApiRequest };
