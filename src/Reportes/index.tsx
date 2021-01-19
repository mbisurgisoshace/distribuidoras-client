import * as React from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AgGridReact } from 'ag-grid-react';

import * as styles from './styles.css';
import ReportesService from '../services/reportes';
import { RoutedOuterWrapper as OuterWrapper } from '../shared/layouts/OuterWrapper';
import { Button } from '../shared/components/Button';

interface ReportesState {
  report: any;
}

export class Reportes extends React.Component<any, ReportesState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      report: null
    }
  }

  getRows = () => {
    const { report } = this.state;

    if (report && report.length > 0) {
      return report;
    }

    return [];
  }

  getColumns = () => {
    const { report } = this.state;

    if (report && report.length > 0) {
      return Object.keys(report[0]).map(k => ({
        field: k,
        filter: true,
        headerName: k,
        sortable: true
      }))
    }

    return [];
  }

  exportReport = () => {
    const { report } = this.state;
    this.exportAsExcelFile(report, 'Recuperados');
  }

  onGenerateReport = async (name: string) => {
    if (name === 'recuperados') {
      const result = await ReportesService.getReporteRecuperados();
      this.setState(({
        report: result
      }))
      //this.exportAsExcelFile(result, 'Recuperados');
    }

    if (name ==='comodatos_movimientos') {
      const result = await ReportesService.getReporteMovimientosComodato();
      this.setState(({
        report: result
      }))
    }
  };

  exportAsExcelFile = (json, excelFilename) => {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFilename);
  }

  saveAsExcelFile = (buffer, filename) => {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data = new Blob([buffer], { type: EXCEL_TYPE });

    FileSaver.saveAs(data, `${filename}_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const rows = this.getRows();
    const columns = this.getColumns();

    return (
      <OuterWrapper>
        <div className={styles.Reportes}>
          <div className={styles.ReportesHeader}>
            <ul>
              <li onClick={() => this.onGenerateReport('recuperados')}>Recuperados</li>
              <li onClick={() => this.onGenerateReport('comodatos_movimientos')}>Movimientos Comodato</li>
            </ul>
            {this.state.report && <Button size='tiny' onClick={this.exportReport}>Exportar</Button>}
          </div>
          <div className={styles.ReportesWrapper}>
            {columns.length > 0 && (
              <div className="ag-theme-balham" style={ {height: '100%', width: '100%'} }>
                <AgGridReact
                  rowData={rows}
                  columnDefs={columns}
                  suppressCellSelection={true}
                  onGridReady={this.onGridReady}
                >
                </AgGridReact>
              </div>
            )}
          </div>
        </div>
      </OuterWrapper>
    )
  }
}
