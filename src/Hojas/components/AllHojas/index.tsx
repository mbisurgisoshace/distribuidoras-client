import * as React from 'react';
import { startCase } from 'lodash';

import * as styles from './styles.css';

import { Hoja } from '../../../types';

import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import HojasService from '../../../services/hojas';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '../../../shared/components/Button';
import { Link } from 'react-router-dom';

interface AllHojasState {
  loading: boolean;
  hojas: Array<Hoja>
}

export class AllHojas extends React.Component<any, AllHojasState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      hojas: [],
      loading: true
    };
  }

  async componentDidMount() {
    await this.fetchHojas();
  }

  fetchHojas = async () => {
    this.setState({ loading: true });
    const hojas = await HojasService.getHojas();

    this.setState({ hojas, loading: false });
  };

  onSelectClient = (e) => {
    const { hoja_ruta_id } = e.data;

    if (hoja_ruta_id) {
      window.open(`/hojas/${hoja_ruta_id}`, '_blank');
    }
  };

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'hoja_ruta_id',
      headerName: 'Id',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'apellido',
      headerName: 'Chofer',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'fecha',
      headerName: 'Fecha',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'control_stock',
      headerName: 'Control Stock',
      cellClass: 'no-border',
      cellRenderer: 'estadoRenderer',
      cellStyle: {'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}
    }, {
      filter: true,
      sortable: true,
      field: 'cierre_stock',
      headerName: 'Cierre Stock',
      cellClass: 'no-border',
      cellRenderer: 'estadoRenderer',
      cellStyle: {'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}
    }, {
      filter: true,
      sortable: true,
      field: 'estado',
      headerName: 'Estado',
      cellClass: 'no-border',
      cellRenderer: 'estadoRenderer',
      cellStyle: {'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}
    }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  };

  render() {
    const { hojas, loading } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.AllHojas}>
          <div className={styles.AllHojasWrapper}>
            <div style={{marginBottom: 5, display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
              <Link to={'/hojas/new'}>
                <Button size={'tiny'}>Abrir Hoja</Button>
              </Link>
            </div>
            <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                pagination={true}
                rowData={hojas}
                rowSelection={'single'}
                columnDefs={this.getColumns()}
                onGridReady={this.onGridReady}
                onRowDoubleClicked={this.onSelectClient}
                suppressCellSelection={true}
                frameworkComponents={{
                  estadoRenderer: EstadoRenderer,
                  stockRenderer: StockRenderer
                }}
              />
            </div>
          </div>
        </div>
      </OuterWrapper>
    );
  }
}

class EstadoRenderer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
      value: props.value,
    };
  }

  checkState = (estado: boolean) => {
    return <div className={styles.Estado} style={{backgroundColor: estado ? 'rgba(106, 176, 76, 0.5)' : 'rgba(235, 77, 75, 0.5)'}} />
  }

  refresh(params) {
    if (params.value !== this.state.value) {
      this.setState({
        value: params.value,
      });
    }
    return true;
  }

  render() {
    return this.checkState(this.state.value);
  }
}

class StockRenderer extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
      value: props.value,
    };
  }

  checkState = (estado: boolean) => {
    return <div className={styles.Estado} style={{backgroundColor: estado ? 'rgba(235, 77, 75, 0.5)' : 'rgba(106, 176, 76, 0.5)'}} />
  }

  refresh(params) {
    if (params.value !== this.state.value) {
      this.setState({
        value: params.value,
      });
    }
    return true;
  }

  render() {
    return this.checkState(this.state.value);
  }
}
