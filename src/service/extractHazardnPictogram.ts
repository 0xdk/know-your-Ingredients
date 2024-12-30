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

  sections.forEach((section) => {
    // Checks if the section contains an "Information" key
    if (section.Information) {
      section.Information.forEach((info) => {
        // Extract "GHS Hazard Statements"
        if (info.Name === 'GHS Hazard Statements' && info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (
              markup.String &&
              // some() iterates through the extractedData.hazardStatements array to check duplicates,
              // worst-case complexity is O(m * n)(number of loops * length of hazardStatements[])
              !extractedData.hazardStatements.some((statement) => statement === markup.String)
            ) {
              extractedData.hazardStatements.push(markup.String);
            }
          });
        }

        // Extract "Pictogram(s)" URLs
        if (info.Name === 'Pictogram(s)' && info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.Markup) {
              markup.Markup.forEach((entry) => {
                // checks if Pictogram is already stored, But complexity is O(n) or maybe O(m * n)
                if (!extractedData.pictograms.some((p) => p.Extra === entry.Extra)) {
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

    // Recursively search in nested sections
    if (section.Section) {
      const nestedData = extractInformation(section.Section);
      extractedData.hazardStatements.push(...nestedData.hazardStatements);
      extractedData.pictograms.push(...nestedData.pictograms);
    }
  });

  return extractedData;
}

export default extractInformation;
