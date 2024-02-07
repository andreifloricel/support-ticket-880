import { Component } from '@angular/core';
import { IPNLAdjustment } from '../../entities/pnlAdjustment';
import { PNLAdjustmentService } from '../../services/pnlAdjustmentService';
import { IUserDetails } from '../../entities/userDetails';
import { UserDetailsService } from '../../services/userDetailsService';
import { Books, Categories } from '../../entities/enums';
import { GridApi, GridOptions, Module } from '@ag-grid-community/core';
import { AdaptableOptions, PredefinedConfig } from '@adaptabletools/adaptable-angular-aggrid';
import { defaultAdaptableOptions } from 'src/app/Modules/adaptableModules';
import { OtherPLTradeService } from 'src/app/services/otherPLTradeService';
import { IOtherPLTrade } from 'src/app/entities/otherPLTrade';
import { SocketClientService } from 'src/app/services/socketClientService';
import { INotification } from 'src/app/entities/notification';
import { RequiredModules } from 'src/app/Modules/agGridModules';


const predefinedConfig: PredefinedConfig = {
  Dashboard: {
    IsHidden: true,
    ModuleButtons: ['FlashingCell'],
    Tabs: [{
      Name: 'Default',
      Toolbars: [
        'Export',
        'QuickSearch',
        'Application',
      ],
    }],
  },
  Theme: {
    CurrentTheme: 'dark',
  },
};

@Component({
  selector: 'pnl-adjustment',
  templateUrl: 'pnl-adjustment.component.html',
  styleUrls: ['pnl-adjustment.component.scss'],
})
export class PnlAdjustmentComponent {


  public categories: any;
  public keys: any;
  public books: String[];
  public errorMessage: string;
  public existingAdjustments: IPNLAdjustment[];
  public temp: any;
  public summaryDates: any[] = [];
  public module: Module[] = RequiredModules;
  book: string = '';
  category: string = '';
  adjustmentValue: string = '';
  adjustmentComment: string = '';
  public userDetails: IUserDetails;
  public userName: string;
  public timezone: string;
  public selectedDate: string = '';
  adjustment: IPNLAdjustment;
  adaptableOptions: AdaptableOptions = {
    ...defaultAdaptableOptions,
    primaryKey: 'Book',
    adaptableId: 'PnlAdjustment',
    predefinedConfig,
  };
  gridOptions: GridOptions = {
    // Column Definitions .....
    columnDefs: this.createColumnDefs(),
    defaultColDef: {
      editable: false,
      resizable: true,
    },
    components: {
      'cellformater': this.cellFormatFields,
    },
    // General Properties
    rowHeight: 22,
    sideBar: true,
    enableRangeSelection: true,
    enableCellChangeFlash: true,
    rowSelection: 'single',
    masterDetail: false,
    pivotMode: false,
    pagination: false,
    paginationPageSize: 45,
    detailRowHeight: 100,
    // Functions
    onGridReady: (params) => this.onGridReady(params),
  };
  private otherPLTrades: IOtherPLTrade[] = [];
  private summaryRows: any[] = [];
  private gridApi: GridApi;
  private currentlySelectedDate;

  constructor(
    private pnlAdjustmentService: PNLAdjustmentService,
    private userDetailsService: UserDetailsService,
    private otherPLTradeService: OtherPLTradeService,
    private socket: SocketClientService,
  ) {
  }

  async ngOnInit() {
    // Subscribe to notifications for incoming events
    this.socket.otherPLTradeNotificationSource.subscribe(notification => {
      this.processNotification(notification);
    });

    this.keys = Object.keys;
    this.categories = Categories;

    this.books = Object.keys(Books);
    this.books = this.books.slice(this.books.length / 2);

    this.userDetails = await this.userDetailsService.userDetails.toPromise();
    this.userName = this.userDetails.Name;
  }

  async processNotification(notification: INotification) {
    const trade: IOtherPLTrade = notification.details;
    const rolesToNotify: Array<string> = notification.roles;
    const notificationType: string = notification.type;

    if (!await this.shouldNotificationBeDisplayed(rolesToNotify)) {
      return;
    }

    this.UpdateRecord(trade);
  }

  UpdateRecord(trade: IOtherPLTrade) {
    this.otherPLTradeService.getTrades().subscribe((data: IOtherPLTrade[]) => {
        if (!data) {
          return;
        }

        this.otherPLTrades = data;

        this.populateDates();

        this.calculateSummary(this.currentlySelectedDate);
      },
      error => this.errorMessage = <any>error,
    );
  }

  async shouldNotificationBeDisplayed(rolesToNotify: Array<string>) {

    const userRole = this.userDetails.Roles;
    if (!userRole) {
      return false;
    }
    const filteredRoles = userRole.filter(value => rolesToNotify.includes(value));
    return filteredRoles && filteredRoles.length > 0;
  }

  createColumnDefs(): any[] {
    this.keys = Object.keys;
    this.categories = Categories;
    const columnDef = [];

    columnDef.push({
      field: 'Book',
    });

    for (let category of this.keys(this.categories)) {
      columnDef.push({
        headerName: this.categories[category], field: category,
      });
    }
    return columnDef;
  }

  getFormattedDate() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1; // January = 0
    let currentDay = currentDate.getDate();
    var month, day;
    if (currentMonth < 10) {
      month = '0' + currentMonth.toString();
    } else {
      month = currentMonth;
    }
    if (currentDay < 10) {
      day = '0' + currentDay.toString();
    } else {
      day = currentDay;
    }
    return month.toString() + '/' + day.toString() + '/' + currentDate.getFullYear().toString();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.otherPLTradeService.getTrades().subscribe({
      next: (data: IOtherPLTrade[]) => {
        if (!data) {
          return;
        }

        this.otherPLTrades = data;
        this.populateDates();
        this.calculateSummary(this.getFormattedDate());
      },
      error: error => this.errorMessage = <any>error,
    });
  }

  cellFormatFields(data: any) {
    if (data.value) {
      const val = Number(data.value);
      if (val < 0) {
        return `(${Math.abs(Number(val)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')})`;
      } else {
        return Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    return 0; //CHECKME
  }

  populateDates() {
    this.summaryDates = [];
    this.summaryDates.push(this.getFormattedDate());

    for (let trade of this.otherPLTrades) {
      if (!this.summaryDates.includes(trade.tradeDate)) {
        this.summaryDates.push(trade.tradeDate);
      }
    }

    if (this.selectedDate != undefined && this.selectedDate.length > 0) {
      this.currentlySelectedDate = this.selectedDate;
      this.selectedDate = this.selectedDate;
    } else {
      this.currentlySelectedDate = this.getFormattedDate();
      this.selectedDate = this.getFormattedDate();
    }
  }

  calculateSummary(selectedDate) {
    const rows = new Array;
    this.books = Object.keys(Books);
    this.books = this.books.slice(this.books.length / 2);

    for (let book of this.books) {
      // get summations

      let derivAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'D' && t.tradeDate == selectedDate);
      let derivCount = derivAdjustments != undefined ? derivAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let treasAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'T' && t.tradeDate == selectedDate);
      let treasCount = treasAdjustments != undefined ? treasAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let agencyAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'A' && t.tradeDate == selectedDate);
      let agencyCount = agencyAdjustments != undefined ? agencyAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let edFuturesAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'E' && t.tradeDate == selectedDate);
      let edFuturesCount = edFuturesAdjustments != undefined ? edFuturesAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let edFuturesOptionsAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'O' && t.tradeDate == selectedDate);
      let edFuturesOptionsCount = edFuturesOptionsAdjustments != undefined ? edFuturesOptionsAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let notesAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'N' && t.tradeDate == selectedDate);
      let notesCount = notesAdjustments != undefined ? notesAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let notesoptionsAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'P' && t.tradeDate == selectedDate);
      let notesoptionsCount = notesoptionsAdjustments != undefined ? notesoptionsAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let repoAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'Re' && t.tradeDate == selectedDate);
      let repoCount = repoAdjustments != undefined ? repoAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      let rollAdjustments = this.otherPLTrades.filter(t => t.book == book && t.type == 'R' && t.tradeDate == selectedDate);
      let rollCount = rollAdjustments != undefined ? rollAdjustments.reduce((accum, item) => accum + item.pnl, 0) : 0;

      this.temp = {
        'Book': book,
        'D': derivCount,
        'T': treasCount,
        'A': agencyCount,
        'E': edFuturesCount,
        'O': edFuturesOptionsCount,
        'N': notesCount,
        'P': notesoptionsCount,
        'Re': repoCount,
        'R': rollCount,
      };

      rows.push(this.temp);
    }

    this.summaryRows = rows;
    this.gridApi.setRowData(rows);
    this.gridApi.sizeColumnsToFit();
  }

  summaryDateChanged(newSelection) {
    this.otherPLTradeService.getTrades().subscribe((data: IOtherPLTrade[]) => {
        if (!data) {
          return;
        }

        this.otherPLTrades = data;
        this.populateDates();

        let newFormattedDate = newSelection.split(': ');
        this.currentlySelectedDate = newFormattedDate[1];
        this.selectedDate = newFormattedDate[1];
        this.calculateSummary(newFormattedDate[1]);
      },
      error => this.errorMessage = <any>error,
    );
  }
}

  
  