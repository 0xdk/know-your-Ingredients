interface StringWithMarkup {
  String: string;
  Markup?: Array<{
    Start: number;
    Length?: number;
    URL?: string;
    Type?: string;
    Extra?: string;
  }>;
}

interface Information {
  ReferenceNumber: number;
  Value: {
    StringWithMarkup: StringWithMarkup[];
  };
}

interface Section {
  TOCHeading?: string;
  Description?: string;
  Information?: Information[];
  Section?: Section[];
}

export interface PubChemResponse {
  Record: {
    Section: Section[];
    Reference: any[];
  };
}

export interface extractedString {
  headings: string;
  extractedString: string[];
}

/**
 * Extracts "Safety and Toxic" data from the PubChem API response.
 * @param response - Response form from the API request
 * @returns extracted data of PubChem API response.
 */

function extractStringsFromResponse(response: PubChemResponse): extractedString {
  const strings: extractedString = {
    headings: '',
    extractedString: [],
  };

  // Copy sections from the response into a stack and process each section using a loop.
  const stack: Section[] = [...response.Record.Section];
  while (stack.length > 0) {
    const currentSection = stack.pop()!;

    // Process headings
    if (currentSection.TOCHeading) {
      strings.headings = currentSection.TOCHeading.trim();
    }

    // Process Information array
    if (currentSection.Information) {
      for (const info of currentSection.Information) {
        if (info.Value?.StringWithMarkup) {
          for (const markup of info.Value.StringWithMarkup) {
            if (markup.String) {
              strings.extractedString.push(markup.String.trim());
            }
          }
        }
      }
    }

    // Push nested sections into the stack for making sure every section is processed
    if (currentSection.Section) {
      stack.push(...currentSection.Section);
    }
  }

  return strings;
}

export default extractStringsFromResponse;
