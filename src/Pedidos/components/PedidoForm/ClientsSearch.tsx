import * as React from 'react';
import { AgGridReact,  } from 'ag-grid-react';

import { Cliente } from '../../../types';

import { Modal } from '../../../shared/components/Modal';
import ClientesService from '../../../services/clientes';

interface ClientsSearchProps {
  onClose: () => void;
  onSelectClient: (cliente) => void;
}

interface ClientsSearchState {
  loading: boolean;
  clientes: Array<Cliente>
}

export class ClientsSearch extends React.Component<ClientsSearchProps, ClientsSearchState> {
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
    const clientes = await ClientesService.getClientesByCanal(1);

    this.setState({ clientes, loading: false });
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

  onSelectClient = (e) => {
    const {onClose, onSelectClient} = this.props;

    onClose();
    onSelectClient(e.data);
  };

  render() {
    const { onClose } = this.props;
    const { clientes, loading } = this.state;

    return (
      <Modal
        show={true}
        onOk={onClose}
        okText={'Cerrar'}
      >
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
      </Modal>
    )
  }
}
