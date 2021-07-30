import * as React from 'react';
import * as moment from 'moment';
import { AgGridReact } from 'ag-grid-react';

import * as styles from './styles.css';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import { PanelFiltros } from './PanelFiltros';
import MovimientosService from '../../../services/movimientos';

interface MonitorState {
  pedidos: Array<any>
}

export class Monitor extends React.Component<any, MonitorState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      pedidos: []
    }
  }

  async componentDidMount() {
    await this.onSearch();
  }

  getColumns = () => {
    return [{
      sortable: true,
      field: 'ClienteID',
      headerName: 'Codigo',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'Direccion',
      headerName: 'Direccion',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'Fecha',
      headerName: 'Fecha',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'CondicionVentaNombre',
      headerName: 'Condicion Venta',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'EstadoMovimientoNombre',
      headerName: 'Estado',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'ZonaNombre',
      headerName: 'Zona',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'CanalNombre',
      headerName: 'Canal',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'Monto',
      headerName: 'Monto',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'Apellido',
      headerName: 'Chofer',
      cellClass: 'no-border'
    }, {
      sortable: true,
      field: 'Observaciones',
      headerName: 'Observaciones',
      cellClass: 'no-border'
    }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  };

  onSearch = async (currFilter = null) => {
    let filters;

    if (!currFilter) {
      filters = {
        desde: moment().format('DD-MM-YYYY'),
        hasta: moment().format('DD-MM-YYYY')
      }
    }

    filters = {
      ...filters,
      ...currFilter
    }

    const pedidos = await MovimientosService.searchMovimientos(filters);
    this.setState({
      pedidos
    })
  }

  render() {
    const { pedidos } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.MonitorWrapper}>
          <PanelFiltros
            onSearch={this.onSearch}
          />
          <div className='ag-theme-balham' style={{ flex: 1, width: '100%' }}>
            <AgGridReact
              pagination={true}
              rowData={pedidos}
              rowSelection={'single'}
              columnDefs={this.getColumns()}
              onGridReady={this.onGridReady}
              //onRowDoubleClicked={this.onSelectClient}
              suppressCellSelection={true}
            />

          </div>
        </div>
      </OuterWrapper>
    )
  }
}
