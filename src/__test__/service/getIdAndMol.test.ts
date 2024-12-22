import getIdAndMolInfo from '../../service/getIdAndMol';
import axios from 'axios';

jest.mock('axios');

describe('getIdAndMolInfo', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return CID for a valid element name', async () => {
    const mockResponse = {
      data: {
        PropertyTable: {
          Properties: [{ CID: 12345 }],
        },
      },
    };

    // Mock axios.get implementation
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue(mockResponse);

    const elementName = 'Octocrylene';
    const cid = await getIdAndMolInfo(elementName);

    // Assertions
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${elementName}/property/MolecularFormula,MolecularWeight,CanonicalSMILES/JSON`
    );
    expect(cid).toBe(12345);
  });

  it('should throw an error for an invalid element name', async () => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockRejectedValue(new Error('Not Found'));

    const elementName = 'InvalidName';

    await expect(getIdAndMolInfo(elementName)).rejects.toThrow('Not Found');
  });
});
