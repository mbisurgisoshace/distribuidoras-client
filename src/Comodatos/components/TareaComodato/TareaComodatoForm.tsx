import * as React from 'react';
import { AgGridReact,  } from 'ag-grid-react';

import * as styles from './styles.css';

import { Select } from '../../../shared/components/Select';
import { DatePicker } from '../../../shared/components/DatePicker';

import { Chofer, Comodato as IComodato } from '../../../types';
import ChoferesService from '../../../services/choferes';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';
import * as moment from 'moment';
import ComodatosService from '../../../services/comodatos';
import { Button } from '../../../shared/components/Button';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface TareaComodatoFormState {
  loading: boolean;
  vigentes: Array<any>;
  choferes: Array<Chofer>;
  editableTarea: IEditable<any>;
}

export class TareaComodatoForm extends React.Component<any, TareaComodatoFormState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      choferes: [],
      vigentes: [],
      editableTarea: {
        fecha: moment().format('DD/MM/YYYY')
      }
    }
  }

  async componentDidMount() {
    const choferes = await ChoferesService.getChoferes();
    const vigentes = await ComodatosService.getComodatosVigente();

    this.setState({
      loading: false,
      choferes,
      vigentes
    })
  }

  onFieldChange = (e) => {
    const { editableTarea = {} } = this.state;
    this.setState({
      editableTarea: {
        ...editableTarea,
        [e.target.name]: e.target.value
      }
    });
  };

  getUpdatedTarea = () => {
    const { editableTarea = {} } = this.state;

    return {
      ...editableTarea
    };
  };

  getColumns = () => {
    return [{
      filter: true,
      sortable: true,
      field: 'comodato_enc_id',
      headerName: 'Id',
      cellClass: 'no-border',
      checkboxSelection: true
    },
      {
      filter: true,
      sortable: true,
      field: 'cliente_id',
      headerName: 'Codigo Cliente',
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
        field: 'nro_comprobante',
        headerName: 'Comprobante',
        cellClass: 'no-border'
      }, {
        filter: true,
        sortable: true,
        field: 'fecha',
        headerName: 'Fecha',
        cellClass: 'no-border'
      }];
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  onSubmit = async () => {
    const gestiones = [];
    const { editableTarea } = this.state;
    this.gridApi.getSelectedNodes().forEach(n => {
      let comodato = n.data;
      gestiones.push({
        fecha: editableTarea.fecha,
        chofer_id: editableTarea.chofer_id,
        comodato_enc_id: comodato.comodato_enc_id,
        nro_comprobante: comodato.nro_comprobante
      })
    });

    await ComodatosService.gestionarComodato(gestiones);
    window.location.reload(false);
  }

  render() {
    const { loading, choferes, vigentes } = this.state;

    const choferesOptions = choferes.map(c => ({
      value: c.chofer_id,
      label: `${c.apellido}, ${c.nombre}`
    }));

    return (
      <div className={styles.TareaComodatoForm}>
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.ComodatoInfo}>
            <div className={styles.ComodatoInfoLeft}>
              <div className={styles.row}>
                <DatePicker
                  size='small'
                  value={this.getUpdatedTarea().fecha || moment().format('DD-MM-YYYY')}
                  name='fecha'
                  label={'Fecha'}
                  onChange={this.onFieldChange}/>

                <Select
                  size='small'
                  name='chofer_id'
                  label='Chofer'
                  value={this.getUpdatedTarea().chofer_id}
                  options={choferesOptions}
                  onChange={this.onFieldChange}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.DetalleWrapper}>
                  <div className="ag-theme-balham" style={{ height: '400px', width: '100%' }}>
                    <AgGridReact
                      pagination={true}
                      rowData={vigentes}
                      rowSelection={'multiple'}
                      columnDefs={this.getColumns()}
                      onGridReady={this.onGridReady}
                      suppressCellSelection={true}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.row} style={{marginTop: '1rem'}}>
                <Button size='small' outline onClick={this.onSubmit}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
