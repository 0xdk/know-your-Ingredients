import axios from 'axios';
import getHazardAndPictogramData from '../../service/hazard/getHazardnPictogram';

jest.mock('axios');

describe('getHazardAndPictogramData', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return hazard and pictogram data when API response is valid', async () => {
    const mockData = {
      data: {
        Record: {
          Section: [{ ToxData: 'Example Hazard Data' }],
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue(mockData);

    const result = await getHazardAndPictogramData(233);
    expect(result).toEqual(mockData.data.Record.Section);
  });

  it('should return null when API request fails with an Axios error', async () => {
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
    const result = await getHazardAndPictogramData(233);
    expect(result).toBeNull();
  });

  it('should throw an error for unknown errors', async () => {
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(getHazardAndPictogramData(233)).rejects.toThrow(
      'An unknown error occurred while fetching data'
    );
  });
});
