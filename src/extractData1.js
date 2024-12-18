function extractInformation(sections) {
  const extractedData = {
    hazardStatements: [],
    pictograms: [],
  };

  sections.forEach((section) => {
    // Check if the section contains an "Information" key
    if (section.Information) {
      section.Information.forEach((info) => {
        // Extract "GHS Hazard Statements"
        if (
          info.Name === 'GHS Hazard Statements' &&
          info.Value?.StringWithMarkup
        ) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.String) {
              extractedData.hazardStatements.push(markup.String);
            }
          });
        }

        // Extract "Pictogram(s)" URLs
        if (info.Name === 'Pictogram(s)' && info.Value?.StringWithMarkup) {
          info.Value.StringWithMarkup.forEach((markup) => {
            if (markup.Markup) {
              markup.Markup.forEach((entry) => {
                if (entry.URL) {
                  extractedData.pictograms.push({
                    URL: entry.URL,
                    Extra: entry.Extra,
                  });
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
const targetNames = ['GHS Hazard Statements', 'Pictogram(s)'];
// const extractedData = extractInformation(data.Record.Section, targetNames);

export default extractInformation;
