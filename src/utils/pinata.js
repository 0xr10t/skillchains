const PINATA_API_KEY = "08d9f497177442505d14";
const PINATA_SECRET_KEY = "b2832f36dcc66b802322561d65026e5f1342956f023dea1a84ab8e2b16194805";
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5ZThhZjFjOS00YTdkLTRkNTAtYTVmZi1mNjA2MjA5YTEwMDIiLCJlbWFpbCI6InNvaGFtdmlqYXlvcDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjA4ZDlmNDk3MTc3NDQyNTA1ZDE0Iiwic2NvcGVkS2V5U2VjcmV0IjoiYjI4MzJmMzZkY2M2NmI4MDIzMjI1NjFkNjUwMjZlNWYxMzQyOTU2ZjAyM2RlYTFhODRhYjhlMmIxNjE5NDgwNSIsImV4cCI6MTc2OTk4NTQ3M30.z0tQCL2oryXmsFO39vmF_oAK-vlS7nn5G6Up9w9ybqY";

export const getImageFromPinata = async (fileName) => {
  try {
    console.log('getImageFromPinata called with fileName:', fileName);
    
    if (!fileName) {
      console.error('No fileName provided to getImageFromPinata');
      return null;
    }
    
    // First, search for the file in Pinata
    const searchUrl = `https://api.pinata.cloud/data/pinList?metadata[name]=${fileName}`;
    console.log('Searching Pinata with URL:', searchUrl);
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Pinata API error:', {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        error: errorText
      });
      return null;
    }

    console.log('Pinata API response status:', searchResponse.status);
    const searchData = await searchResponse.json();
    console.log('Pinata API response data:', searchData);
    
    if (searchData.rows && searchData.rows.length > 0) {
      // Get the IPFS hash (CID) of the first matching file
      const ipfsHash = searchData.rows[0].ipfs_pin_hash;
      console.log('Found IPFS hash:', ipfsHash);
      
      // Construct the IPFS gateway URL
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      console.log('Constructed image URL:', imageUrl);
      return imageUrl;
    }
    
    console.log('No matching files found in Pinata for:', fileName);
    return null;
  } catch (error) {
    console.error('Detailed error in getImageFromPinata:', error);
    console.error('Error stack:', error.stack);
    return null;
  }
}; 