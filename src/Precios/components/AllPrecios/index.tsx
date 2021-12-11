import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';

import * as styles from './styles.css';

import { Envase, ListaPrecio, Precio } from '../../../types';
import PreciosService from '../../../services/precios';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import EnvasesService from '../../../services/envases';
import { FormDetail } from './FormDetail';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

interface AllPreciosState {
  isNew: boolean;
  loading: boolean;
  syncing: boolean;
  nombreLista: string;
  currentLista: number;
  precios: Array<Precio>;
  envases: Array<Envase>;
  listas: Array<ListaPrecio>;
}

export class AllPrecios extends React.Component<any, AllPreciosState> {
  gridApi;
  gridColumnApi;
  formDetailRef;

  constructor(props) {
    super(props);

    this.formDetailRef = React.createRef();

    this.state = {
      loading: true,
      syncing: false,
      nombreLista: '',
      listas: [],
      precios: [],
      envases: [],
      isNew: false,
      currentLista: null
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const envases = await EnvasesService.getEnvases();
    const listas = await PreciosService.getListasPrecio();

    this.setState({
      listas,
      envases,
      loading: false
    })
  }

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'lista_precio_id',
      headerName: 'Id',
      cellClass: 'no-border'
    }, {
      filter: true,
      sortable: true,
      field: 'lista_precio_nombre',
      headerName: 'Nombre',
      cellClass: 'no-border'
    }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  };

  onPrecioClick = async (selectedRow) => {
    this.setState({
      loading: true
    });
    const { lista_precio_id } = selectedRow.data;
    const precios = await PreciosService.getListaPrecio(lista_precio_id);

    this.setState({
      isNew: false,
      loading: false,
      nombreLista: '',
      precios: precios,
      currentLista: lista_precio_id
    })
  }

  onGuardar = async () => {
    const { currentLista, nombreLista } = this.state;

    try {
      if (this.formDetailRef && this.formDetailRef.current) {
        if (currentLista) {
          await PreciosService.updatePrecio(currentLista, {
            items: this.formDetailRef.current.getItems()
          })
        } else {
          const precio = {
            lista_precio_nombre: nombreLista,
            items: this.formDetailRef.current.getItems()
          }

          await PreciosService.createPrecio(precio);

          this.setState({
            isNew: false,
            loading: false,
            nombreLista: '',
            precios: []
          });
        }

        const listas = await PreciosService.getListasPrecio();

        this.setState({
          listas
        })
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  onAgregar = () => {
    const precios = this.state.envases.map(envase => ({
      envase_id: envase.envase_id,
      precio: 0
    }))

    this.setState({
      precios,
      isNew: true,
      nombreLista: '',
      currentLista: null
    })
  }

  render() {
    const { isNew, nombreLista, listas, precios, loading, syncing, envases, currentLista } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.AllPrecios}>
          <div className={styles.AllPreciosWrapper}>
            <div className='ag-theme-balham' style={{ height: 500, width: '100%' }}>
              <Button size={'tiny'} onClick={this.onAgregar}>Agregar</Button>
              <AgGridReact
                pagination={true}
                rowData={listas}
                rowSelection={'single'}
                suppressCellSelection={true}
                columnDefs={this.getColumns()}
                onGridReady={this.onGridReady}
                onRowClicked={this.onPrecioClick}
              />
            </div>
            {currentLista && !loading && (
              <div style={{marginTop: 25, display: 'flex', flexDirection: 'column'}}>
                <div className={styles.row} style={{marginTop: 25, display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                  <FormDetail
                    precios={precios}
                    ref={this.formDetailRef}
                    onGuardar={this.onGuardar}
                    envases={envases.map(e => ({value: e.envase_id, label: e.envase_nombre}))}
                  />
                </div>
              </div>
            )}
            {isNew && (
              <div style={{marginTop: 25, display: 'flex', flexDirection: 'column'}}>
                <Input size={'small'} value={nombreLista} onChange={(e) => this.setState({nombreLista: e.target.value})} />
                <div className={styles.row} style={{marginTop: 25, display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                  <FormDetail
                    precios={precios}
                    ref={this.formDetailRef}
                    onGuardar={this.onGuardar}
                    envases={envases.map(e => ({value: e.envase_id, label: e.envase_nombre}))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </OuterWrapper>
    )
  }
}
