// const searchResponse: AxiosResponse = await GHSinfo.get(
//   `${4632}/JSON/?response_type=display&heading=GHS+Classification`
// );
// //   console.log(searchResponse);
// const extractData = extractInformation(searchResponse.data.Record.Section);
// // const extractedData = extractInformation(data.Record.Section, targetNames);
// console.log(extractData);
// res.send('might work');

// Pharmacology
// https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/338/JSON/?response_type=display&heading=Pharmacology

// Food Additives
// https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/338/JSON/?response_type=display&heading=Food%20Additives

// gets lot of info test it

/**
 * 
 *     const GHSinfo = axios.create({
      // https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/338/JSON/?response_type=display&heading=GHS+Classification
      baseURL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/`,
    });

    // const searchResponse: AxiosResponse = await GHSinfo.get(
    //   `${id}/JSON/?response_type=display&heading=GHS+Classification`
    // );

    const searchResponse: AxiosResponse = await GHSinfo.get(`${id}/JSON/?`);
 */
