import { useState, useEffect, useRef, memo } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { debounce } from 'lodash';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-balham.css";
import { ssrmGridConfig, csrmGridConfig } from "./utils/rowModelConfig";
import { getDefaultOptions } from "./utils/gridOptions";
import { LicenseManager } from "@ag-grid-enterprise/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";

// Predefine module registration and license setup
LicenseManager.setLicenseKey("YOUR_LICENSE_KEY");
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ServerSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  MenuModule,
  SetFilterModule,
]);

// Utility function to merge configurations efficiently
const mergeConfigs = (defaultConfig, customConfig) => {
  return { ...defaultConfig, ...customConfig };
};

const AgGrid = memo(({
  customColumnType = {},
  onGridReadyCallback,
  customColumnDef = {},
  customGridOptions = {},
  dataSource,
  rowModelType = "clientSide",
  col = [],
  apiRefCallback,
  gridApiStateCallback,
  onSortChanged,
  onFilterChanged,
  customClassName = "",
  customStyle = {},
  ...remainingAgGridProps
}) => {
  const { 
    defaultColumnDef, 
    defaultColumnTypes, 
    defaultGridOpts 
  } = getDefaultOptions();

  const [gridApi, setGridApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState(col);
  const gridRef = useRef(null);

  // Improved debounce using lodash
  const debouncedSizeColumnsToFit = useRef(
    debounce((api) => api.sizeColumnsToFit(), 300)
  ).current;

  // Simplified effect for column definitions
  useEffect(() => {
    setColumnDefs(col);
  }, [col]);

  // Simplified grid ready handler
  const onGridReady = (params) => {
    setGridApi(params.api);
    
    // Use optional chaining to simplify callback handling
    gridApiStateCallback?.(params.api);
    
    if (apiRefCallback) {
      apiRefCallback.current = params.api;
    }
    
    onGridReadyCallback?.(params);

    // Set datasource for server-side row model
    if (dataSource && rowModelType === "serverSide") {
      params.api.setServerSideDatasource(dataSource);
    }
  };

  // Memoize only the critical configurations
  const columnTypes = mergeConfigs(defaultColumnTypes, customColumnType);
  const defaultColDef = mergeConfigs(defaultColumnDef, customColumnDef);
  
  // Simplified grid options preparation
  const gridOptions = {
    ...defaultGridOpts,
    ...(rowModelType === "serverSide" ? ssrmGridConfig : csrmGridConfig),
    ...customGridOptions,
    ...remainingAgGridProps,
  };

  // Simplified first data rendered handler
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  // Simplified row data updated handler
  const onRowDataUpdated = (params) => {
    debouncedSizeColumnsToFit(params.api);
  };

  return (
    <div
      className={`ag-theme-balham ${customClassName}`}
      style={{ height: "100%", width: "100%", ...customStyle }}
    >
      <AgGridReact
        {...gridOptions}
        defaultColDef={defaultColDef}
        columnTypes={columnTypes}
        columnDefs={columnDefs}
        ref={gridRef}
        enableCellTextSelection={true}
        onFirstDataRendered={onFirstDataRendered}
        onRowDataUpdated={onRowDataUpdated}
        onSortChanged={onSortChanged}
        onFilterChanged={onFilterChanged}
        onGridReady={onGridReady}
      />
    </div>
  );
});

export default AgGrid;