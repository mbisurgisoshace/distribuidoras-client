import * as React from 'react';
import * as moment from 'moment';
import { AgGridReact } from 'ag-grid-react';

import * as styles from './styles.css';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import { PanelFiltros } from './PanelFiltros';
import MovimientosService from '../../../services/movimientos';
import { Modal } from '../../../shared/components/Modal';
import { Canal, Chofer, CondicionVenta, Hoja } from '../../../types';
import EstadosMovimientoService from '../../../services/estadosMovimiento';
import CondicionesVentaService from '../../../services/condicionesVenta';
import HojasService from '../../../services/hojas';
import { Select } from '../../../shared/components/Select';
import TiposMovimientoService from '../../../services/tiposMovimiento';

interface MonitorState {
  tipos: Array<any>;
  hojas: Array<any>;
  pedidos: Array<any>;
  estados: Array<any>;
  isGeneracionRemitos: boolean;
  isActualizacionMasivOpen: boolean;
  condiciones: Array<CondicionVenta>;
  actualizacionMasiva: {
    hoja_ruta_id: number;
    estado_movimiento_id: number;
    condicion_venta_id: number;
    tipo_movimiento_id: number;
  };
}

export class Monitor extends React.Component<any, MonitorState> {
  gridApi;
  gridColumnApi;

  constructor(props) {
    super(props);

    this.state = {
      tipos: [],
      hojas: [],
      pedidos: [],
      estados: [],
      condiciones: [],
      actualizacionMasiva: {
        hoja_ruta_id: null,
        estado_movimiento_id: null,
        condicion_venta_id: null,
        tipo_movimiento_id: null
      },
      isGeneracionRemitos: false,
      isActualizacionMasivOpen: false
    };
  }

  async componentDidMount() {
    const hojas = await HojasService.getHojas();
    const tipos = await TiposMovimientoService.getTiposMovimiento();
    const estados = await EstadosMovimientoService.getEstadosMovimiento();
    const condiciones = await CondicionesVentaService.getCondicionesVenta();

    this.setState({
      hojas,
      tipos,
      estados,
      condiciones
    });

    await this.onSearch();
  }

  onSelectPedido = (e) => {
    const { MovimientoEncID } = e.data;

    if (MovimientoEncID) {
      window.open(`/pedidos/${MovimientoEncID}`, '_blank');
    }
  };

  getColumns = () => {
    return [{
      sortable: true,
      field: 'MovimientoEncID',
      headerName: 'Id',
      cellClass: 'no-border',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true
    }, {
      sortable: true,
      field: 'TipoMovimientoNombre',
      headerName: 'Tipo Movimiento',
      cellClass: 'no-border'
    },
      {
        sortable: true,
        field: 'ClienteID',
        headerName: 'Codigo',
        cellClass: 'no-border'
      }, {
        sortable: true,
        resizable: true,
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
        resizable: true,
        field: 'CondicionVentaNombre',
        headerName: 'Condicion Venta',
        cellClass: 'no-border'
      }, {
        sortable: true,
        resizable: true,
        field: 'EstadoMovimientoNombre',
        headerName: 'Estado',
        cellClass: 'no-border'
      }, {
        sortable: true,
        resizable: true,
        field: 'ZonaNombre',
        headerName: 'Zona',
        cellClass: 'no-border'
      }, {
        sortable: true,
        resizable: true,
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
        resizable: true,
        field: 'Apellido',
        headerName: 'Chofer',
        cellClass: 'no-border'
      }, {
        sortable: true,
        resizable: true,
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
      };
    }

    filters = {
      ...filters,
      ...currFilter
    };

    const pedidos = await MovimientosService.searchMovimientos(filters);
    this.setState({
      pedidos
    });
  };

  onActualizarMasivo = async () => {
    const { actualizacionMasiva } = this.state;

    const idsPedidos = this.gridApi.getSelectedNodes().map(selection => selection.data.MovimientoEncID);
    const actualizaciones = {};
    Object.keys(actualizacionMasiva).forEach(key => {
      if (actualizacionMasiva[key]) actualizaciones[key] = actualizacionMasiva[key];
    });

    await MovimientosService.updateMovimientosMasivo({
      ids: idsPedidos,
      actualizaciones
    });

    await this.onSearch();

    this.setState({
      actualizacionMasiva: {
        hoja_ruta_id: null,
        estado_movimiento_id: null,
        condicion_venta_id: null,
        tipo_movimiento_id: null
      },
      isActualizacionMasivOpen: false
    });
  };

  render() {
    const {
      tipos,
      pedidos,
      isGeneracionRemitos,
      isActualizacionMasivOpen,
      hojas,
      estados,
      condiciones,
      actualizacionMasiva
    } = this.state;

    const hojasOptions = hojas.map(hoj => ({
      label: `${hoj.apellido}, ${hoj.nombre}`,
      value: hoj.hoja_ruta_id
    }));

    const estadosOptions = estados.map(est => ({
      label: est.estado_movimiento_nombre,
      value: est.estado_movimiento_id
    }));

    const condicionesOptions = condiciones.map(con => ({
      label: con.condicion_venta_nombre,
      value: con.condicion_venta_id
    }));

    const tiposOptions = tipos.map(tip => ({
      label: tip.tipo_movimiento_nombre,
      value: tip.tipo_movimiento_id
    }));

    return (
      <OuterWrapper>
        <div className={styles.MonitorWrapper}>
          <PanelFiltros
            onSearch={this.onSearch}
            onGeneracionRemitos={() => this.setState({ isGeneracionRemitos: true })}
            onActualizacionMasiva={() => this.setState({ isActualizacionMasivOpen: true })}
          />
          <div className='ag-theme-balham' style={{ flex: 1, width: '100%' }}>
            <AgGridReact
              pagination={true}
              rowData={pedidos}
              rowSelection={'multiple'}
              columnDefs={this.getColumns()}
              onGridReady={this.onGridReady}
              onRowDoubleClicked={this.onSelectPedido}
              suppressCellSelection={true}
            />
          </div>
          <Modal
            showCancel={true}
            headerText={'Generacion de Remitos'}
            show={isGeneracionRemitos}
            onOk={() => this.onActualizarMasivo()}
            onCancel={() => this.setState({ isGeneracionRemitos: false })}
            size='large'
          >
            Generacion Remitos
          </Modal>
          <Modal
            showCancel={true}
            headerText={'Actualizacion Masiva de Pedidos'}
            show={isActualizacionMasivOpen}
            onOk={() => this.onActualizarMasivo()}
            onCancel={() => this.setState({
              isActualizacionMasivOpen: false,
              actualizacionMasiva: {
                hoja_ruta_id: null,
                estado_movimiento_id: null,
                condicion_venta_id: null,
                tipo_movimiento_id: null
              }
            })}
            size='medium'
          >
            <Select
              size='small'
              label='Hoja'
              name='hoja_ruta_id'
              placeholder='Seleccionar...'
              value={actualizacionMasiva.hoja_ruta_id}
              options={hojasOptions}
              onChange={(e) => this.setState({
                actualizacionMasiva: {
                  ...actualizacionMasiva,
                  hoja_ruta_id: e.target.value
                }
              })}
            />
            <Select
              size='small'
              label='Estado'
              name='estado_movimiento_id'
              placeholder='Seleccionar...'
              value={actualizacionMasiva.estado_movimiento_id}
              options={estadosOptions}
              onChange={(e) => this.setState({
                actualizacionMasiva: {
                  ...actualizacionMasiva,
                  estado_movimiento_id: e.target.value
                }
              })}
            />
            <Select
              size='small'
              label='Condicion de Venta'
              name='condicion_venta_id'
              placeholder='Seleccionar...'
              value={actualizacionMasiva.condicion_venta_id}
              options={condicionesOptions}
              onChange={(e) => this.setState({
                actualizacionMasiva: {
                  ...actualizacionMasiva,
                  condicion_venta_id: e.target.value
                }
              })}
            />
            <Select
              size='small'
              label='Tipo de Movimiento'
              name='tipo_movimiento_id'
              placeholder='Seleccionar...'
              value={actualizacionMasiva.tipo_movimiento_id}
              options={tiposOptions}
              onChange={(e) => this.setState({
                actualizacionMasiva: {
                  ...actualizacionMasiva,
                  tipo_movimiento_id: e.target.value
                }
              })}
            />
          </Modal>
        </div>
      </OuterWrapper>
    );
  }
}
