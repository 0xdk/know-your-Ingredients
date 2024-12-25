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

export interface extractedPharmacology {
  PharmacologyString: string[];
}

/**
 * Extracts "Pharmacology" data from the PubChem API response.
 * @param response - Response form from the API request
 * @returns extracted data of Pharmacology
 */

function extractStringsFromResponse(
  response: PubChemResponse
): extractedPharmacology {
  const strings: extractedPharmacology = {
    PharmacologyString: [],
  };

  function traverseSection(section: Section) {
    if (section.Information) {
      section.Information.forEach((info) => {
        if (info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.String) {
              strings.PharmacologyString.push(markup.String.trim());
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
