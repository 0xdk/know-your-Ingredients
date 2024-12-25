import axios from 'axios';
import getPharmacologyData from '../../service/getPharmacology';

interface PubChemResponse {
  Record: {};
}

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getPharmacologyData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully fetch pharmacology data', async () => {
    const mockResponse: { data: PubChemResponse } = {
      data: {
        Record: {},
      },
    };

    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await getPharmacologyData(54670067);
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle empty response data', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: null }),
    } as any);

    await expect(async () => {
      await getPharmacologyData(54670067);
    }).rejects.toThrow('No Pharmacology data in the response');
  });

  it('should handle axios error', async () => {
    const axiosError = new Error('PubChem API Error: Network error');
    (axiosError as any).isAxiosError = true;
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(axiosError),
    } as any);

    await expect(async () => {
      await getPharmacologyData(54670067);
    }).rejects.toThrow('PubChem API Error: Network error');
  });

  it('should handle unknown errors', async () => {
    const unknownError = new Error(
      'An unknown error occurred while fetching data'
    );
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(unknownError),
    } as any);

    await expect(async () => {
      await getPharmacologyData(54670067);
    }).rejects.toThrow('An unknown error occurred while fetching data');
  });

  it('should handle malformed response data', async () => {
    const malformedResponse = {
      data: {
        Record: {
          RecordType: 'CID',
          RecordNumber: 54670067,
          RecordTitle: 'Test Compound',
          Section: [],
          Reference: [],
        },
      },
    };

    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue(malformedResponse),
    } as any);

    const result = await getPharmacologyData(54670067);
    expect(result).toEqual(malformedResponse.data);
  });
});
