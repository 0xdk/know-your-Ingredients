import request from 'supertest';
import express from 'express';
import { getInfoRoute } from '../../routes/indexRoute';
import fetchWikiInfo from '../../service/wiki';
import getIdAndMolInfo from '../../service/getIdAndMol';
import safetyAndToxicInfoService from '../../service/safety_and_Toxic/safetyAndToxicInfoService';
import hazardService from '../../service/hazard/hazardService';

// Mock Express App
const app = express();
app.use(express.json());
app.use('/api', getInfoRoute);

// Mocking Services
jest.mock('../../service/wiki');
jest.mock('../../service/getIdAndMol');
jest.mock('../../service/safety_and_Toxic/safetyAndToxicInfoService');
jest.mock('../../service/hazard/hazardService');

describe('GET /api/get-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if input query param is missing', async () => {
    const response = await request(app)
      .post('/api/get-info') // Change to POST
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Input is required from route');
  });

  it('should return valid response when all services return expected data', async () => {
    (fetchWikiInfo as jest.Mock).mockResolvedValue('Phenoxyethanol is the organic compound');
    (getIdAndMolInfo as jest.Mock).mockResolvedValue({
      Properties: [{ CID: 31236 }],
    });
    (safetyAndToxicInfoService as jest.Mock).mockResolvedValue({
      Pharmacology: {},
      'Effects of Long Term Exposure': {},
      'Human Toxicity Excerpts': {},
    });
    (hazardService as jest.Mock).mockResolvedValue({
      hazardStatements: [],
      pictograms: [],
    });

    const response = await request(app)
      .post('/api/get-info') // Change to POST
      .set('Content-Type', 'application/json') // Set header
      .send({ input: 'Phenoxyethanol' }); // Send data in body

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      wikiData: 'Phenoxyethanol is the organic compound',
      IdAndMol: [{ CID: 31236 }],
      hazardsAndPictograms: { hazardStatements: [], pictograms: [] },
      safetyAndToxicData: {
        Pharmacology: {},
        'Effects of Long Term Exposure': {},
        'Human Toxicity Excerpts': {},
      },
    });
  });

  it('should return 404 if no data is found', async () => {
    (fetchWikiInfo as jest.Mock).mockResolvedValue(undefined);
    (getIdAndMolInfo as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/api/get-info') // Change to POST
      .set('Content-Type', 'application/json') // Set header
      .send({ input: 'Phenoxyethanol' }); // Send data in body

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      'error',
      'No result found for the provided input. Please check the spelling or try another name.'
    );
  });
});
