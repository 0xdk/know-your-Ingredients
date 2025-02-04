import OpenAI from 'openai';
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

async function fetchElementInfoFromOpenAI(elementName: string): Promise<string | null | undefined> {
  try {
    const prompt = `For the element "${elementName}", provide the following details in a structured format:
1. Common Uses: Describe where this element is commonly used, including specific industries, products, or applications. Provide examples to illustrate its significance.
2. Sourcing: Explain where this element is sourced from, detailing natural occurrences, mining locations, or the manufacturing processes involved in obtaining it.
3.Health Risks: List the common side effects or health risks associated with exposure to this element. Include any relevant statistics or studies if applicable.
4.Mechanism of Action: Provide a simple explanation of how this element works in its applications or within biological systems.
5. Regulatory Status: Indicate whether this element is banned in any countries. If applicable, list those countries and provide a brief rationale for the bans.
6.Safety for Vulnerable Populations: Clarify whether kids, older individuals, or pregnant women can safely use or interact with this element. Include any specific guidelines or recommendations.

Ensure that the information is presented clearly and concisely, using simple English for accessibility.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: `You are a highly knowledgeable assistant specializing in chemical elements, their properties, uses, and safety information`,
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
    return data;
  } catch (error: any) {
    console.error(error.message);
  }
}

export default fetchElementInfoFromOpenAI;
