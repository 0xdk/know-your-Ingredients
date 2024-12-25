import { Request, Response } from 'express';

// API calls
import getIdAndMolInfo from '../service/getIdAndMol';
import getHazardAndPictogramData from '../service/getHazardnPictogram';
import getPharmacologyData from '../service/getPharmacology';

// TS interfaces
import { ExtractedData } from '../service/extractHazardnPictogram';
import { extractedPharmacology } from '../service/extractPharmacology';

// functions to extract needed data from the response
import extractInformation from '../service/extractHazardnPictogram';
import extractStringsFromResponse from '../service/extractPharmacology';

async function handleApiRequest(req: Request, res: Response) {
  try {
    const userInput: string = req.body.input;
    if (!userInput) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }
    // getting PubChem ID
    const id: Number = await getIdAndMolInfo(userInput);
    // getting Hazard and Pictogram Data
    const hazardAndPictogramData = await getHazardAndPictogramData(id);
    // getting Pharmacology Data
    const PharmacologyData = await getPharmacologyData(id);
    // extracting Pharmacology Data
    const extractPharmacologyData: extractedPharmacology =
      extractStringsFromResponse(PharmacologyData);
    // extracting Hazard and Pictogram Data
    const extractHazardAndPictogramData: ExtractedData = extractInformation(
      hazardAndPictogramData
    );

    res.json(extractHazardAndPictogramData);
  } catch (error: any) {
    console.error('Error handling API request:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default { handleApiRequest };
