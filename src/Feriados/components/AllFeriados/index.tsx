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
import FeriadosService from '../../../services/feriados';
import { DatePicker } from '../../../shared/components/DatePicker';
import { Checkbox } from '../../../shared/components/Checkbox';
import * as moment from 'moment';

interface AllFeriadosState {
  isNew: boolean;
  loading: boolean;
  currentFeriado: any;
  feriados: Array<any>;
}

export class AllFeriados extends React.Component<any, AllFeriadosState> {
  gridApi;
  gridColumnApi;
  formDetailRef;

  constructor(props) {
    super(props);

    this.formDetailRef = React.createRef();

    this.state = {
      isNew: false,
      loading: true,
      feriados: [],
      currentFeriado: null
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const feriados = await FeriadosService.getFeriados();

    this.setState({
      feriados,
      loading: false
    })
  }

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'feriado_id',
      headerName: 'Id',
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
      field: 'medio_dia',
      headerName: 'Medio Dia',
      cellClass: 'no-border'
    }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  };

  onFeriadoClick = async (selectedRow) => {
    const { feriado_id } = selectedRow.data;

    const feriado = this.state.feriados.find(f => f.feriado_id === feriado_id);

    this.setState({
      isNew: false,
      currentFeriado: {
        ...feriado,
        fecha: moment.utc(feriado.fecha).format('DD-MM-YYYY')
      }
    })
  }

  onGuardar = async () => {
    const { currentFeriado } = this.state;

    try {
      if (currentFeriado.feriado_id) {
        await FeriadosService.updateFeriado(currentFeriado.feriado_id, {
          ...currentFeriado,
          fecha: moment(currentFeriado.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD')
        });
      } else {
        await FeriadosService.createFeriado({
          ...currentFeriado,
          fecha: moment(currentFeriado.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD')
        })
      }

      const feriados = await FeriadosService.getFeriados();

      this.setState({
        feriados,
        isNew: false,
        currentFeriado: null,
      })
    } catch (err) {
      console.log('err', err);
    }
  }

  onAgregar = () => {
    this.setState({
      isNew: true,
      currentFeriado: {
        fecha: '',
        medio_dia: false
      }
    })
  }

  render() {
    const { isNew, feriados, currentFeriado } = this.state;

    return (
      <OuterWrapper>
        <div className={styles.AllFeriados}>
          <div className={styles.AllFeriadosWrapper}>
            <div className='ag-theme-balham' style={{ height: 500, width: '100%' }}>
              <Button size={'tiny'} onClick={this.onAgregar}>Agregar</Button>
              <AgGridReact
                pagination={true}
                rowData={feriados}
                rowSelection={'single'}
                suppressCellSelection={true}
                columnDefs={this.getColumns()}
                onGridReady={this.onGridReady}
                onRowClicked={this.onFeriadoClick}
              />
            </div>
            {currentFeriado && (
              <div style={{marginTop: 25, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <Button size={'tiny'} onClick={this.onGuardar}>Guardar</Button>
                <div className={styles.row} style={{marginTop: 25, display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                  <DatePicker
                    className={styles.Input}
                    value={currentFeriado.fecha}
                    size={'small'}
                    onChange={(e) => {
                      this.setState({
                        currentFeriado: {
                          ...currentFeriado,
                          fecha: e.target.value
                        }
                      })
                    }} />
                  <div style={{marginRight: 15}} />
                  <Checkbox
                    onChange={() => {
                      this.setState({
                        currentFeriado: {
                          ...currentFeriado,
                          medio_dia: !currentFeriado.medio_dia
                        }
                      })
                    }}
                    checked={currentFeriado.medio_dia}
                  >
                    Medio Dia
                  </Checkbox>
                </div>
              </div>
            )}
            {/*{isNew && (*/}
            {/*  <div style={{marginTop: 25, display: 'flex', flexDirection: 'column'}}>*/}
            {/*    <Input size={'small'} value={nombreLista} onChange={(e) => this.setState({nombreLista: e.target.value})} />*/}
            {/*    <div className={styles.row} style={{marginTop: 25, display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>*/}
            {/*      <FormDetail*/}
            {/*        precios={precios}*/}
            {/*        ref={this.formDetailRef}*/}
            {/*        onGuardar={this.onGuardar}*/}
            {/*        envases={envases.map(e => ({value: e.envase_id, label: e.envase_nombre}))}*/}
            {/*      />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </div>
      </OuterWrapper>
    )
  }
}
