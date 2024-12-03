import React, { useRef, useState, useCallback, Suspense } from "react";
import {
  createFakeServer,
  createServerSideDatasource,
} from "../lib/utils/server.utils";
import { columnDefs } from "./columnDef";
import DelayedDetailRenderer from "./DelayedDetailCellRender";

const AgGridLazy = React.lazy(() => import("../lib/AgGrid"));

const loadingOverlayComponent = () => {
  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <div className="spinner"></div>
      <p>Loading grid...</p>
    </div>
  );
};

const ParentComponent = () => {
  const gridApiRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showHeaderCheckbox, setShowHeaderCheckbox] = useState(false);
  const [disabledRowIds, setDisabledRowIds] = useState([]);

  const generateRandomId = () =>
    `id-${Math.random().toString(36).substr(2, 9)}`;

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    params.api.showLoadingOverlay();

    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => {
        const dataWithIds = data.map((item) => ({
          ...item,
          id: generateRandomId(),
        }));
        const fakeServer = createFakeServer(dataWithIds);
        const serverSideDatasource = createServerSideDatasource(fakeServer);
        params.api.setServerSideDatasource(serverSideDatasource);
        params.api.hideOverlay();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        params.api.showNoRowsOverlay();
      });
  }, []);

  const validateSelectableRows = (selectedRow) => {
    const allRows = [];
    gridApiRef.current.forEachNode((node) => allRows.push(node));

    const validIds = allRows
      .filter((node) => {
        const data = node.data;
        return (
          data?.country === selectedRow?.country &&
          data?.sport === selectedRow?.sport
        );
      })
      .map((node) => node.data.id);

    setDisabledRowIds(
      allRows
        .filter((node) => !validIds.includes(node.data.id))
        .map((node) => node.data.id)
    );

    setShowHeaderCheckbox(validIds.length > 0);
  };

  const onRowSelected = (event) => {
    const rowData = event.node.data;

    if (event.node.isSelected()) {
      setSelectedRows((prev) => [...prev, rowData]);
      validateSelectableRows(rowData);
    } else {
      setSelectedRows((prev) => prev.filter((row) => row.id !== rowData.id));
      setDisabledRowIds([]);
      setShowHeaderCheckbox(false);
    }
  };

  const getSelectedRows = () => {
    console.log("Selected Rows Data:", selectedRows);
    alert(JSON.stringify(selectedRows, null, 2));
  };

  return (
    <div style={{ width: "90vw", height: "90vh" }} className="ag-theme-balham">
      <button onClick={getSelectedRows} style={{ marginBottom: "10px" }}>
        Get Selected Rows
      </button>
      <Suspense
        fallback={
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <div className="spinner"></div>
            <p>Loading grid...</p>
          </div>
        }
      >
        <AgGridLazy
          col={columnDefs(showHeaderCheckbox)}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            sortable: true,
            filter: true,
          }}
          rowModelType="serverSide"
          masterDetail={true}
          detailCellRenderer={DelayedDetailRenderer}
          onGridReadyCallback={onGridReady}
          detailRowAutoHeight={true}
          rowSelection="multiple"
          getRowId={(params) => params.data.id}
          onRowSelected={onRowSelected}
          rowClassRules={{
            "disabled-row": (params) => {
              return params.data && disabledRowIds.includes(params.data.id);
            },
          }}
          isRowSelectable={(node) => node.data && !disabledRowIds.includes(node.data.id)}
          loadingOverlayComponent={loadingOverlayComponent}
        />
      </Suspense>
    </div>
  );
};

export default ParentComponent;
