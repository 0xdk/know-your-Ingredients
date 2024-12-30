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
 * Extracts "Pharmacology" data from the PubChem API response.
 * @param response - Response form from the API request
 * @returns extracted data of Pharmacology
 */

function extractStringsFromResponse(response: PubChemResponse): extractedString {
  const strings: extractedString = {
    headings: '',
    extractedString: [],
  };

  function traverseSection(section: Section) {
    if (section.Information) {
      if (section.TOCHeading) {
        // strings.headings.push(section.TOCHeading.trim());
        strings.headings = section.TOCHeading.trim();
      }
      section.Information.forEach((info) => {
        if (info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.String) {
              strings.extractedString.push(markup.String.trim());
            }
          });
        }
      });
    }

    if (section.Section) {
      section.Section.forEach(traverseSection);
    }
  }

  response.Record.Section.forEach(traverseSection);
  return strings;
}

export default extractStringsFromResponse;
