import { ColDef } from '@ag-grid-community/core';

// create AG Grid Column Definitions
export const columnDefs:ColDef[] = [
  {
    colId: 'id',
    hide: true,
    suppressColumnsToolPanel:true,
    suppressFiltersToolPanel:true
  },
  {
    headerName: 'Auto Make',
    field: 'make',
    editable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Model',
    field: 'model',
    editable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Price',
    field: 'price',
    editable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
    type: 'abColDefNumber',
  },
  {
    headerName: 'Date manufactured',
    field: 'date',
    type: 'abColDefDate',
    filter: true,
    floatingFilter: true,
  },
];