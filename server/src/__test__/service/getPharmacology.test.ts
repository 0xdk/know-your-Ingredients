import axios from 'axios';
import getPharmacologyData from '../../service/safety_and_Toxic/getSafetyAndToxicInfo';
// import { PubChemResponse } from '../../service/safety_and_Toxic/extractSafetyAndToxicInfo';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getPharmacologyData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console mocks
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should successfully fetch pharmacology data', async () => {
    const mockResponse = {
      data: {
        Record: {},
      },
    };

    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await getPharmacologyData(54670067, 'heading');
    expect(result).toEqual(mockResponse.data);
  });

  it('should return null for empty response data', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: null }),
    } as any);

    const result = await getPharmacologyData(54670067, 'heading');
    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      'Empty data received for PubChem ID: 54670067, Heading: heading'
    );
  });

  it('should return null for 404 error', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 404,
        data: 'Not Found',
      },
      message: 'Request failed with status code 404',
      name: 'AxiosError',
      config: {},
      toJSON: () => ({}),
    };

    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(axiosError),
    } as any);

    const isAxiosErrorSpy = jest.spyOn(axios, 'isAxiosError');
    isAxiosErrorSpy.mockImplementation((error) => error?.isAxiosError === true);

    const result = await getPharmacologyData(54670067, 'heading');

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      'No data found for PubChem ID: 54670067, Heading: heading'
    );
  });

  it('should handle unknown errors', async () => {
    const unknownError = new Error('Unknown error');
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(unknownError),
    } as any);

    await expect(async () => {
      await getPharmacologyData(54670067, 'heading');
    }).rejects.toThrow('Failed to fetch data for PubChem ID: 54670067, Heading: heading');

    expect(console.error).toHaveBeenCalledWith(
      'Unknown Error getting Safety and Toxic info:',
      unknownError
    );
  });

  it('should create axios instance with correct config', async () => {
    const mockResponse = { data: { Record: {} } };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockCreate = jest.fn().mockReturnValue({ get: mockGet });

    mockedAxios.create = mockCreate;

    await getPharmacologyData(54670067, 'heading');

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/',
      timeout: 10000,
    });

    expect(mockGet).toHaveBeenCalledWith('54670067/JSON/?response_type=display&heading=heading');
  });
});
