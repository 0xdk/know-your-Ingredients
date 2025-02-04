import fetchElementInfo from '../../service/wiki'; // Adjust the import path as needed
import wiki from 'wikijs';

jest.mock('wikijs');

describe('fetchElementInfo', () => {
  it('should return the Wikipedia summary for a given element', async () => {
    const mockSummary = 'Phenoxyethanol is a glycol ether used as a preservative in cosmetics.';
    const mockPage = { summary: jest.fn().mockResolvedValue(mockSummary) };

    (wiki as jest.Mock).mockReturnValue({
      page: jest.fn().mockResolvedValue(mockPage),
    });

    const result = await fetchElementInfo('Phenoxyethanol');
    expect(result).toBe(mockSummary);
  });

  it('should return undefined when Wikipedia API throws an error', async () => {
    (wiki as jest.Mock).mockReturnValue({
      page: jest.fn().mockRejectedValue(new Error('Wikipedia API Error')),
    });

    const result = await fetchElementInfo('UnknownElement');
    expect(result).toBeUndefined();
  });
});
