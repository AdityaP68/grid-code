export const createFakeServer = (allData) => {
    return {
      getData: (request) => {
        // Slice the data for the requested rows
        const requestedRows = allData.slice(request.startRow, request.endRow);
        return {
          success: true,
          rows: requestedRows,
        };
      },
    };
  };
  
  // Create a server-side datasource
  export const createServerSideDatasource = (server) => {
    return {
      getRows: (params) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);
  
        // Fetch data from the fake server
        const response = server.getData(params.request);

        console.log("response", response)
  
        // Simulate a real server call with a delay
        setTimeout(() => {
          if (response.success) {
            params.success({ rowData: response.rows });
          } else {
            params.fail();
          }
        }, 500);
      },
    };
  };