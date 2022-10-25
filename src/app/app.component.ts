import { Component } from '@angular/core';
import { GridOptions, Module } from '@ag-grid-community/core';
import {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-angular-aggrid';
import { rowData } from './rowData';
import { RECOMMENDED_MODULES } from './agGridModules';
import { columnDefs, defaultColDef } from './columnDefs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public agGridModules: Module[] = RECOMMENDED_MODULES;
  public adaptableApi: AdaptableApi;
  public gridOptions: GridOptions;

  public adaptableOptions: AdaptableOptions = {
    primaryKey: 'tradeId',
    userName: 'demo-user',
    // licenseKey: <add_provided_license_key>,
    adaptableId: 'AdapTable Angular App',

    layoutOptions: {
      autoSizeColumnsInLayout: true,
    },

    predefinedConfig: {
      Dashboard: {
        Revision: Date.now(),
        ModuleButtons: ['SettingsPanel'],
      },
    },
  };

  constructor() {
    this.gridOptions = {
      enableCharts: true,
      enableRangeSelection: true,
      sideBar: ['adaptable', 'columns', 'filters'],
      suppressMenuHide: true,
      singleClickEdit: true,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent' },
        ],
      },
      defaultColDef,
      columnDefs,
      rowData,
    };
  }

  adaptableReady = ({ adaptableApi, gridOptions }) => {
    this.adaptableApi = adaptableApi;
    // use AdaptableApi for runtime access to Adaptable
  };
}
