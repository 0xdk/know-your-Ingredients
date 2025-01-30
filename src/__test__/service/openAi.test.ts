import OpenAI from 'openai';
import fetchElementInfoFromOpenAI from '../../service/openAi';

jest.mock('openai', () => {
  const mockCreate = jest.fn();
  const mockOpenAI = jest.fn(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));

  return mockOpenAI;
});

describe('fetchElementInfoFromOpenAI', () => {
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockedOpenAI = new (OpenAI as any)();
    mockCreate = mockedOpenAI.chat.completions.create;
  });

  it('should return AI-generated text for a valid element name', async () => {
    const mockResponse = {
      choices: [
        {
          message: { content: 'Hydrogen is used in fuel cells and rocket fuel.' },
        },
      ],
    };

    mockCreate.mockResolvedValueOnce(mockResponse);

    const result = await fetchElementInfoFromOpenAI('Hydrogen');

    expect(result).toBe('Hydrogen is used in fuel cells and rocket fuel.');
  });

  it('should handle errors and return undefined', async () => {
    mockCreate.mockRejectedValueOnce(new Error('OpenAI API error'));

    const result = await fetchElementInfoFromOpenAI('Hydrogen');

    expect(result).toBeUndefined();
  });

  it('should call OpenAI API with correct parameters', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Test response' } }],
    };
    mockCreate.mockResolvedValueOnce(mockResponse);

    await fetchElementInfoFromOpenAI('Hydrogen');

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.any(Array),
      })
    );
  });
});
