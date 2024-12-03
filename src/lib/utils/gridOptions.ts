import { ColDef, ColTypeDef } from "@ag-grid-community/core";

export const getDefaultOptions = () => {
  const filterOptions = {
    filter: "agTextColumnFilter",
    filterParams: {
      debounceMs: 1000,
      maxNumConditions: 1,
      filterOptions: ["contains"],
    },
  };

  const defaultGridOpts = {};

  const defaultColumnDef: ColDef = {
    sortable: true,
    resizable: true,
    wrapText: false,
    filter: true,
    headerClass: "custom-header"
    //suppressMenuHide: true,
  };

  const defaultColumnTypes: { [key: string]: ColTypeDef } = {
    standardGridColumn: {
      ...filterOptions,
    },
    agEqualsFilterColumn: {
      filter: "agTextColumnFilter",
      filterParams: {
        debounceMs: 1000,
        maxNumConditions: 1,
        filterOptions: ["equals"],
      },
    },
    hiddenColumn: {
      ...filterOptions,
      hide: true, // Corrected `hide` to boolean type
    },
    valueFormattedColumn: {}, // Keep as an empty object if no configuration is needed
    noFilter: {
      filter: false,
    },
    standardDateColumn: {
      filter: "agDateColumnFilter",
    },
  };

  return { defaultColumnDef, defaultColumnTypes, defaultGridOpts };
};
