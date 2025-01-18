interface Markup {
  Start?: number;
  Length?: number;
  URL?: string;
  Type?: string;
  Extra?: string;
}

interface StringWithMarkup {
  String: string;
  Markup?: Markup[];
}

interface Information {
  ReferenceNumber?: number;
  Name: string;
  Value?: {
    StringWithMarkup?: StringWithMarkup[];
  };
}

interface Section {
  Information?: Information[];
  Section?: Section[];
}

export interface ExtractedData {
  hazardStatements: string[];
  pictograms: {
    URL: string;
    Extra?: string;
  }[];
}

/**
 * Extracts "GHS Hazard Statements" and "Pictogram(s)" data from the PubChem API response.
 * @param sections - The sections array to search.
 * @returns Extracted data for hazard statements and pictograms.
 */
function extractInformation(sections: Section[]): ExtractedData {
  const extractedData: ExtractedData = {
    hazardStatements: [],
    pictograms: [],
  };

  const seenHazardStatements = new Set<string>();
  const seenPictograms = new Set<string>();
  const stack = [...sections]; // Use a stack to handle nested sections iteratively

  while (stack.length > 0) {
    const section = stack.pop()!; // Process the current section

    if (section.Information) {
      section.Information.forEach((info) => {
        // Extract "GHS Hazard Statements"
        if (info.Name === 'GHS Hazard Statements' && info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.String && !seenHazardStatements.has(markup.String)) {
              seenHazardStatements.add(markup.String); // Avoid duplicates
              extractedData.hazardStatements.push(markup.String);
            }
          });
        }

        // Extract "Pictogram(s)" URLs
        if (info.Name === 'Pictogram(s)' && info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.Markup) {
              markup.Markup.forEach((entry) => {
                if (entry.Extra && !seenPictograms.has(entry.Extra)) {
                  seenPictograms.add(entry.Extra); // Avoid duplicates
                  if (entry.URL) {
                    extractedData.pictograms.push({
                      URL: entry.URL,
                      Extra: entry.Extra,
                    });
                  }
                }
              });
            }
          });
        }
      });
    }

    // Push nested sections onto the stack
    if (section.Section) {
      stack.push(...section.Section);
    }
  }
  console.log(extractedData);
  return extractedData;
}

export default extractInformation;
