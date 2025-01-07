import wiki from 'wikijs';

async function fetchElementInfo(elementName: string): Promise<string | null> {
  try {
    // getting element summery from wiki and returning
    return await (await wiki().page(elementName)).summary();
  } catch (error: any) {
    console.error(`Error fetching Wikipedia data for ${elementName}:`, error);
    // returning null to the API
    return null;
  }
}
export default fetchElementInfo;
