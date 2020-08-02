import * as React from 'react';
import { AgGridReact,  } from 'ag-grid-react';

import * as styles from './styles.css';

import { Cliente } from '../../../types';

import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import ClientesService from '../../../services/clientes';

interface AllClientesState {
  loading: boolean;
  clientes: Array<Cliente>
}

export class AllClientes extends React.Component<any, AllClientesState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      clientes: []
    };
  }

  async componentDidMount() {
    await this.fetchClientes();
  }

  fetchClientes = async () => {
    this.setState({ loading: true });
    const clientes = await ClientesService.getClientes();

    this.setState({ clientes, loading: false });
  };

  onSelectClient = (e) => {
    const { cliente_id } = e.data;

    if (cliente_id) {
      window.open(`/clientes/${cliente_id}`, '_blank')
    }
  };

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'cliente_id',
      headerName: 'Codigo',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'razon_social',
      headerName: 'Razon Social',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'calle',
      headerName: 'Calle',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'altura',
      headerName: 'Altura',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'telefono',
      headerName: 'Telefono',
      cellClass: 'no-border'
    }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const { clientes, loading } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.AllClientes}>
          <div className={styles.AllClientesWrapper}>
            <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                pagination={true}
                rowData={clientes}
                rowSelection={'single'}
                columnDefs={this.getColumns()}
                onGridReady={this.onGridReady}
                onRowDoubleClicked={this.onSelectClient}
                suppressCellSelection={true}
              />

            </div>
          </div>
        </div>
      </OuterWrapper>
    );
  }
}
