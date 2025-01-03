import wiki from 'wikijs';

async function fetchElementInfo(elementName: string): Promise<string | null> {
  try {
    // Initialize the Wikipedia API
    const summary = await (await wiki().page(elementName)).summary();

    return summary;
  } catch (error: any) {
    // * refactor this
    console.error(`Error fetching Wikipedia data for ${elementName}:`, error.status);
    return null;
  }
}
export default fetchElementInfo;
