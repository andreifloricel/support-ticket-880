import { ColDef } from '@ag-grid-community/core';

export const defaultColDef: ColDef = {
  filter: true,
  floatingFilter: true,
  sortable: true,
  resizable: true,
  enablePivot: true,
  enableRowGroup: true,
  enableValue: true,
};

export const columnDefs: ColDef[] = [
  {
    headerName: 'Trade Id',
    field: 'tradeId',
    editable: true,
    type: 'abColDefNumber',
  },
  {
    headerName: 'Notional',
    field: 'notional',
    enableValue: true,
    editable: true,
    cellClass: 'number-cell',
    type: 'abColDefNumber',
    aggFunc: 'sum',
  },
  {
    headerName: 'Counterparty',
    field: 'counterparty',
    editable: true,
    enableRowGroup: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Change',
    field: 'changeOnYear',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Currency',
    field: 'currency',
    editable: true,
    enableRowGroup: true,
    type: 'abColDefString',
  },
  {
    headerName: 'B/O Spread',
    field: 'bidOfferSpread',
    enableValue: true,
    editable: true,
    type: 'abColDefNumber',
  },
  {
    headerName: 'Price',
    field: 'price',
    enableValue: true,
    enableRowGroup: true,
    type: 'abColDefNumber',
  },
  {
    headerName: 'Country',
    field: 'country',
    editable: true,
    enableRowGroup: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Status',
    field: 'status',
    editable: true,
    pivot: true,
    enableRowGroup: true,
    enablePivot: true,
    aggFunc: 'sum',
    type: 'abColDefString',
    resizable: true,
  },
  {
    headerName: 'Trade Date',
    field: 'tradeDate',
    type: 'abColDefDate',
  },
  {
    headerName: 'Settlement Date',
    field: 'settlementDate',
    type: 'abColDefDate',
  },
  {
    headerName: 'Ask',
    field: 'ask',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Bid',
    field: 'bid',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Ind Ask',
    field: 'indicativeAsk',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Ind Bid',
    field: 'indicativeBid',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Markit Ask',
    field: 'markitAsk',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Markit Bid',
    field: 'markitBid',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Bbg Ask',
    field: 'bloombergAsk',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Bbg Bid',
    field: 'bloombergBid',
    type: 'abColDefNumber',
  },
  {
    headerName: 'Rating',
    field: 'rating',
    editable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'History',
    field: 'history',
    type: 'abColDefObject',
    resizable: true,
    cellRenderer: 'agSparklineCellRenderer',
    cellRendererParams: {
      sparklineOptions: {
        type: 'line',
        line: {
          stroke: 'rgb(124, 255, 178)',
          strokeWidth: 2,
        },
        padding: {
          top: 5,
          bottom: 5,
        },
        marker: {
          size: 3,
          shape: 'diamond',
        },
        highlightStyle: {
          size: 10,
        },
      },
    },
  },
];
