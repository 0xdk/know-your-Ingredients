import { Request, Response } from 'express';
import extractInformation from '../service/extractHazardnPictogram';
import getIdAndMolInfo from '../service/getIdAndMol';
import getHazardAndPictogramData from '../service/getHazardnPictogram';
import { ExtractedData } from '../service/extractHazardnPictogram';

async function handleApiRequest(req: Request, res: Response) {
  try {
    const userInput: string = req.body.input;
    if (!userInput) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }

    const id: Number = await getIdAndMolInfo(userInput);
    const hazardAndPictogramData = await getHazardAndPictogramData(id);

    const extractData: ExtractedData = extractInformation(
      hazardAndPictogramData
    );

    res.json(extractData);
  } catch (error: any) {
    console.error('Error handling API request:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default { handleApiRequest };
