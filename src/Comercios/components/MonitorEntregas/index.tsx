import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import * as styles from './styles.css';

import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import ComerciosService from '../../../services/comercios';
import { Button } from '../../../shared/components/Button';

interface MonitorEntregasState {
  loading: boolean;
  entregas: Array<any>
}

export class MonitorEntregas extends React.Component<any, MonitorEntregasState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      entregas: []
    };
  }

  async componentDidMount() {
    await this.fetchEntregas();
  }

  fetchEntregas = async () => {
    this.setState({ loading: true });
    const entregas = await ComerciosService.getPedidos();

    this.setState({ entregas, loading: false });
  };

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'id',
      headerName: 'Nro Entrega',
      cellClass: 'no-border',
      checkboxSelection: true,
    }, {
      filter: true,
      sortable: true,
      field: 'fecha',
      headerName: 'Fecha',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'movimiento_enc_id',
      headerName: 'Nro Pedido',
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

  onSubmit = async () => {
    const ids = [];
    const selection = this.gridApi.getSelectedNodes();
    selection.forEach(n => {
      ids.push(n.data.id);
    })

    await ComerciosService.entregarPedidoComercio(ids);
    await this.fetchEntregas();
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const {entregas, loading} = this.state;

    return (
      <OuterWrapper>
        <div className={styles.MonitorEntregas}>
          <div className={styles.MonitorEntregasWrapper}>
            <Button size='small' outline onClick={this.onSubmit}>
              Marcar como entregados
            </Button>
            <div className="ag-theme-balham" style={{ height: '95%', width: '100%' }}>
              <AgGridReact
                pagination={true}
                rowData={entregas}
                rowSelection={'multiple'}
                columnDefs={this.getColumns()}
                onGridReady={this.onGridReady}
                //onRowDoubleClicked={this.onSelectComercio}
                suppressCellSelection={true}
              />
            </div>
          </div>
        </div>
      </OuterWrapper>
    )
  }
}
