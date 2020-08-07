import * as React from 'react';
import { AgGridReact,  } from 'ag-grid-react';

import { Comercio } from '../../../types';

import { Modal } from '../../../shared/components/Modal';

import ComerciosService from '../../../services/comercios';

interface ComerciosSearchProps {
  onClose: () => void;
  onSelectComercio: (comercio) => void;
}

interface ComerciosSearchState {
  loading: boolean;
  comercios: Array<Comercio>
}

export class ComerciosSearch extends React.Component<ComerciosSearchProps, ComerciosSearchState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      comercios: []
    };
  }

  async componentDidMount() {
    await this.fetchClientes();
  }

  fetchClientes = async () => {
    this.setState({ loading: true });
    const comercios = await ComerciosService.getComercios();

    this.setState({ comercios, loading: false });
  };

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'id',
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

  onSelectComercio = (e) => {
    const {onClose, onSelectComercio} = this.props;

    onClose();
    onSelectComercio(e.data);
  };

  render() {
    const { onClose } = this.props;
    const { comercios, loading } = this.state;

    return (
      <Modal
        show={true}
        onOk={onClose}
        okText={'Cerrar'}
      >
        <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            pagination={true}
            rowData={comercios}
            rowSelection={'single'}
            columnDefs={this.getColumns()}
            onGridReady={this.onGridReady}
            onRowDoubleClicked={this.onSelectComercio}
            suppressCellSelection={true}
          />
        </div>
      </Modal>
    )
  }
}
