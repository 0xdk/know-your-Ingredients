import { Request, Response } from 'express';
import extractInformation from '../service/extractHazardnPictogram';
import getIdAndMolInfo from '../service/getIdandMol';
import getHazardAndPictogramData from '../service/getHazardnPictogram';
import { ExtractedData } from '../service/extractHazardnPictogram';

async function handleApiRequest(req: Request, res: Response): Promise<void> {
  try {
    // const userInput: string = req.body.input; // Ensure userInput is a string
    const userInput: string = 'Octocrylene'; // Ensure userInput is a string
    if (!userInput) {
      res.status(400).json({ error: 'Input is required' });
      return;
    }

    const id: Number = await getIdAndMolInfo(userInput); // First API call
    const hazardAndPictogramData = await getHazardAndPictogramData(id);
    const extractData: ExtractedData = extractInformation(
      hazardAndPictogramData.data.Record.Section
    );
    console.log(extractData);
    res.json(extractData);
  } catch (error: any) {
    console.error('Error handling API request:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default handleApiRequest;
