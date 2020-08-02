import * as React from 'react';
import { AgGridReact,  } from 'ag-grid-react';

import * as styles from './styles.css';

import { Comercio } from '../../../types';

import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import ComerciosService from '../../../services/comercios';

interface AllComerciosState {
  loading: boolean;
  comercios: Array<Comercio>
}

export class AllComercios extends React.Component<any, AllComerciosState> {
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
    await this.fetchComercios();
  }

  fetchComercios = async () => {
    this.setState({ loading: true });
    const comercios = await ComerciosService.getComercios();

    this.setState({ comercios, loading: false });
  };

  onSelectComercio = (e) => {
    const { id } = e.data;

    if (id) {
      window.open(`/comercios/${id}`, '_blank')
    }
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

  render() {
    const { comercios, loading } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.AllComercios}>
          <div className={styles.AllComerciosWrapper}>
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
          </div>
        </div>
      </OuterWrapper>
    );
  }
}
