import { Request, Response } from 'express';
import indexController from '../../controllers/indexController';
import * as getIdAndMol from '../../service/getIdAndMol';
import * as getHazardAndPictogram from '../../service/getHazardnPictogram';
import * as extractInfo from '../../service/extractHazardnPictogram';
import { AxiosResponse } from 'axios';

jest.mock('../../service/getIdAndMol');
jest.mock('../../service/getHazardnPictogram');
jest.mock('../../service/extractHazardnPictogram');

describe('handleApiRequest', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      body: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  it('should return 400 if userInput is missing', async () => {
    req.body = {};

    await indexController.handleApiRequest(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Input is required' });
  });

  it('should return extracted data on valid input', async () => {
    req.body = { input: 'Salicylic Acid' };

    const mockId = 12345;
    const mockHazardData = {
      data: {
        Record: {
          Section: 'mockSection',
        },
      },
    };
    const mockExtractedData = {
      hazardStatements: [],
      pictograms: [],
    };

    jest.spyOn(getIdAndMol, 'default').mockResolvedValue(mockId);
    jest
      .spyOn(getHazardAndPictogram, 'default')
      .mockResolvedValue(mockHazardData as AxiosResponse);
    jest.spyOn(extractInfo, 'default').mockReturnValue(mockExtractedData);

    await indexController.handleApiRequest(req as Request, res as Response);

    expect(getIdAndMol.default).toHaveBeenCalledWith(req.body.input);
    expect(getHazardAndPictogram.default).toHaveBeenCalledWith(mockId);
    expect(extractInfo.default).toHaveBeenCalledWith({
      data: { Record: { Section: 'mockSection' } },
    });
    expect(res.json).toHaveBeenCalledWith(mockExtractedData);
  });

  it('should handle errors and return 500', async () => {
    req.body = { input: 'Octocrylene' };

    jest
      .spyOn(getIdAndMol, 'default')
      .mockRejectedValue(new Error('API Error'));

    await indexController.handleApiRequest(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Something went wrong',
    });
  });
});
