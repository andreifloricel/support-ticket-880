import { Component } from '@angular/core';
import { GridOptions, Module } from '@ag-grid-community/core';
import {
  AdaptableApi,
  AdaptableOptions,
} from '@adaptabletools/adaptable-angular-aggrid';
import { rowData } from './rowData';
import { RECOMMENDED_MODULES } from './agGridModules';
import { columnDefs } from './columnDefs';

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
    primaryKey: 'id',
    userName: 'demo-user',
    // licenseKey: <add_provided_license_key>,
    adaptableId: 'AdapTable Angular App',
    predefinedConfig: {
      Dashboard: {
        Revision: Date.now(),
        Tabs: [
          {
            Name: 'Default',
            Toolbars: ['Layout', 'Query'],
          },
        ],
      },
    },
  };

  constructor() {
    this.gridOptions = {
      columnDefs,
      rowData,
    };
  }

  adaptableReady = ({ adaptableApi, gridOptions }) => {
    this.adaptableApi = adaptableApi;
    // use AdaptableApi for runtime access to Adaptable
  };
}
