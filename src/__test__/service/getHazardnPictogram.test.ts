import getHazardAndPictogramData from '../../service/getHazardnPictogram';
import axios from 'axios';

jest.mock('axios');

describe('getHazardAndPictogramData', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return Hazard and Pictogram data when API call is successful', async () => {
    const mockResponse = {
      data: {
        Record: {
          Section: ['Mocked Hazard Data'],
        },
      },
    };

    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue(mockResponse);

    const cid = 338;
    const result = await getHazardAndPictogramData(cid);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${cid}/JSON/?response_type=display&heading=GHS+Classification`
    );
    expect(result).toEqual(['Mocked Hazard Data']);
  });

  it('should throw an error if the API call fails', async () => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const cid = 338;

    await expect(getHazardAndPictogramData(cid)).rejects.toThrow(
      'An unknown error occurred while fetching data'
    );
  });

  it('should throw an unknown error if an unexpected error occurs', async () => {
    const cid = 338;

    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockImplementation(() => {
      throw 'Unknown Error';
    });

    await expect(getHazardAndPictogramData(cid)).rejects.toThrow(
      'An unknown error occurred while fetching data'
    );
  });
});
