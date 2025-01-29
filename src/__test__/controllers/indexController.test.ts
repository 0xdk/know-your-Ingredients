import { Request, Response } from 'express';
import indexController from '../../controllers/indexController';
import * as getIdAndMol from '../../service/getIdAndMol';
import * as fetchWikiInfo from '../../service/wiki';
import * as safetyAndToxicInfoService from '../../service/safety_and_Toxic/safetyAndToxicInfoService';
import * as hazardService from '../../service/hazard/hazardService';

jest.mock('../../service/getIdAndMol');
jest.mock('../../service/wiki');
jest.mock('../../service/safety_and_Toxic/safetyAndToxicInfoService');
jest.mock('../../service/hazard/hazardService');

import { IDMolResponse } from '../../service/getIdAndMol';

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

  it('should return ApiResponse with all data on valid input', async () => {
    req.body = { input: 'Phenoxyethanol' };

    const IDMolResponse: IDMolResponse = {
      Properties: [
        {
          CID: 1234,
          MolecularFormula: 'C8H10O2',
          MolecularWeight: 138.16,
          CanonicalSMILES: 'C1=CC=C(C=C1)OCCO',
        },
      ],
    };

    const mockWikiData = 'Phenoxyethanol is a chemical compound used in cosmetics.';
    const mockSafetyAndToxicData = { safety: 'Low' };
    const mockHazardsAndPictograms = {
      hazardStatements: ['H302 (99.8%): Harmful if swallowed [Warning Acute toxicity, oral]'],
      pictograms: [
        {
          URL: 'https://pubchem.ncbi.nlm.nih.gov/images/ghs/GHS05.svg',
          Extra: 'Corrosive',
        },
      ],
    };

    jest.spyOn(fetchWikiInfo, 'default').mockResolvedValue(mockWikiData);
    jest.spyOn(getIdAndMol, 'default').mockResolvedValue(IDMolResponse);
    jest.spyOn(safetyAndToxicInfoService, 'default').mockResolvedValue(mockSafetyAndToxicData);
    jest.spyOn(hazardService, 'default').mockResolvedValue(mockHazardsAndPictograms);

    await indexController.handleApiRequest(req as Request, res as Response);

    expect(fetchWikiInfo.default).toHaveBeenCalledWith('Phenoxyethanol');
    expect(getIdAndMol.default).toHaveBeenCalledWith('Phenoxyethanol');
    expect(safetyAndToxicInfoService.default).toHaveBeenCalledWith(1234);
    expect(hazardService.default).toHaveBeenCalledWith(1234);
    expect(res.json).toHaveBeenCalledWith({
      wikiData: mockWikiData,
      IdAndMol: IDMolResponse.Properties,
      hazardsAndPictograms: mockHazardsAndPictograms,
      safetyAndToxicData: mockSafetyAndToxicData,
    });
  });

  it('should return 500 on an error', async () => {
    req.body = { input: 'Phenoxyethanol' };

    jest.spyOn(fetchWikiInfo, 'default').mockRejectedValue(new Error('Wiki API Error'));

    await indexController.handleApiRequest(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Wiki API Error' });
  });
});
