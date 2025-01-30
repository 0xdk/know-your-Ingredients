import OpenAI from 'openai';
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

async function fetchElementInfoFromOpenAI(elementName: string): Promise<string | null | undefined> {
  try {
    const prompt = `You are an expert assistant specializing in providing detailed and accurate information about chemical elements.  
For the element "${elementName}", provide the following details:
1.Where this element is commonly used (e.g., industries, products, or applications).  
2.Where this element is sourced from (e.g., natural occurrence, mining, or manufacturing processes).  
3.Common side effects or health risks associated with this element.  
4.How it works.
5.Whether this element is banned in any country, and if so, list the countries.  
6.Can kids, older people, or pregnant women safely use or interact with this element?  
7.Toxicity and hazard information about this element.  
Respond with one or more of these paragraphs. with simple English`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: `You are a helpful assistant`,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });
    const data = response.choices[0].message.content;
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export default fetchElementInfoFromOpenAI;
