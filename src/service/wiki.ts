import wiki from 'wikijs';

/**
 * Fetches a Summery for the given element name from Wikipedia
 * @param elementName - the name of the element to search for
 * @returns A promise that resolves to the summery string if found, or return undefined if not
 */
async function fetchElementInfo(elementName: string): Promise<string | undefined> {
  try {
    const wikiInstance = wiki();
    const page = await wikiInstance.page(elementName);
    const summery = await page.summary();

    return summery;
  } catch (error: any) {
    if (error instanceof Error) {
      console.error(`Wikipedia API Error for "${elementName}": ${error.message}`);
    } else {
      console.error(
        `Unknown error occurred while fetching Wikipedia data for "${elementName}":`,
        error
      );
    }
    // returning null to the API
    return undefined;
  }
}
export default fetchElementInfo;
