import * as React from 'react';
import { flatten } from 'lodash';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as classnames from 'classnames';
import { Link, Redirect } from 'react-router-dom';

import * as styles from './styles.css';

import { checkHoja, calculateGastos, calculateRendicion, calculateCondicionesPago, hasComodatos } from './utils';

import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/Select';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';

import {
  Hoja as IHoja,
  Zona as IZona,
  Chofer as IChofer,
  Camion as ICamion,
  CargaItem as ICarga,
  Movimiento as IMovimiento,
  CondicionVenta as ICondicionVenta
} from '../../../types';

import ZonasService from '../../../services/zonas';
import ChoferesService from '../../../services/choferes';
import CamionesService from '../../../services/camiones';
import MovimientosService from '../../../services/movimientos';
import { Modal } from '../../../shared/components/Modal';
import CondicionesVentaService from '../../../services/condicionesVenta';
import HojasService from '../../../services/hojas';
import { Checkbox } from '../../../shared/components/Checkbox';
import CargasService from '../../../services/cargas';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface HojaFormProps {
  nuevo?: boolean;
  hoja?: IHoja
}

interface HojaFormState {
  zonas: Array<IZona>;
  cargas: Array<ICarga>;
  choferes: Array<IChofer>;
  camiones: Array<ICamion>;
  editableHoja: IEditable<IHoja>;
  movimientos: Array<IMovimiento>;
  condiciones: Array<ICondicionVenta>;
  loading: boolean;
  showDetalle: boolean;
  checks: {
    checkStock: boolean,
    checkPedidos: boolean,
    checkRendicion: boolean,
    checkComodatos: boolean
  },
  entregaComodatos: boolean;
}

export class HojaForm extends React.Component<HojaFormProps, HojaFormState> {
  constructor(props) {
    super(props);

    this.state = {
      zonas: [],
      cargas: [],
      camiones: [],
      choferes: [],
      movimientos: [],
      condiciones: [],
      editableHoja: {},
      loading: true,
      showDetalle: false,
      checks: {
        checkStock: true,
        checkPedidos: true,
        checkRendicion: true,
        checkComodatos: true
      },
      entregaComodatos: false
    };
  }

  async componentDidMount() {
    const zonas = await ZonasService.getZonas();
    const choferes = await ChoferesService.getChoferes();
    const camiones = await CamionesService.getCamiones();
    const condiciones = await CondicionesVentaService.getCondicionesVenta();
    const cargas = await CargasService.getCargasByHoja(this.props.hoja.hoja_ruta_id)
    const movimientos = await MovimientosService.getMovimientosByHoja(this.props.hoja.hoja_ruta_id);
    const items = flatten(cargas.map(c => c.items));

    this.setState({
      zonas,
      choferes,
      camiones,
      condiciones,
      movimientos,
      cargas: items,
      loading: false
    });
  }

  onFieldChange = (e) => {
    const { editableHoja = {} } = this.state;
    this.setState({
      editableHoja: {
        ...editableHoja,
        [e.target.name]: e.target.value
      }
    });
  };

  getUpdatedHoja = () => {
    const { hoja } = this.props;
    const { editableHoja = {} } = this.state;

    return {
      ...hoja,
      ...editableHoja
    };
  };

  getEstadoStock = () => {
    const { control_stock, cierre_stock } = this.getUpdatedHoja();

    if (!control_stock && !cierre_stock) {
      return {
        label: 'Pendiente',
        style: styles.inactivo
      };
    }

    if (control_stock && !cierre_stock) {
      return {
        label: 'Control',
        style: styles.pendiente
      };
    }

    if (control_stock && cierre_stock) {
      return {
        label: 'Cerrado',
        style: styles.activo
      };
    }
  };

  renderCondiciones = () => {
    const { condiciones, movimientos } = this.state;
    const entregados = movimientos.filter(m => m.estado_movimiento_id === 3);

    let condicionesMap = {};
    condiciones.forEach(c => {
      if (c.condicion_venta_id !== 1) {
        condicionesMap[c.condicion_venta_id] = {
          nombre: c.condicion_venta_nombre,
          monto: 0
        };
      }
    });

    entregados.forEach(m => {
      if (m.condicion_venta_id !== 1) {
        const condicion = condicionesMap[m.condicion_venta_id];
        const { monto } = condicion;
        const newMonto = monto + m.items.reduce((acc, curr) => acc + curr.monto, 0);
        condicionesMap[m.condicion_venta_id] = {
          ...condicion,
          monto: newMonto
        };
      }
    });

    return (
      <div className={styles.CondicionesWrapper}>
        {Object.keys(condicionesMap).map(key => (
          <div key={key} className={styles.CondicionesItem}>
            <div className={styles.label}>{condicionesMap[key].nombre}</div>
            <div>{numeral(condicionesMap[key].monto).format('$0,0.00')}</div>
          </div>
        ))}
      </div>
    );
  };

  onSubmit = async (cerrar: boolean) => {
    this.setState({
      loading: true
    });
    const hoja = this.getUpdatedHoja();

    if (cerrar) {
      const checks = checkHoja(hoja, this.state.movimientos);

      if (checks.checkStock && checks.checkPedidos && checks.checkRendicion) {
        hoja.estado = false;
      } else {
        this.setState({ checks, loading: false });
        return;
      }
    }

    const checkComodato = (hasComodatos(this.state.cargas) && this.state.entregaComodatos) || (!hasComodatos(this.state.cargas) && !this.state.entregaComodatos);

    if (checkComodato) {
      const updatedHoja = await HojasService.updateHoja(hoja.hoja_ruta_id, hoja);

      this.setState({
        checks: {
          checkStock: true,
          checkPedidos: true,
          checkRendicion: true,
          checkComodatos: true
        },
        loading: false,
        editableHoja: { ...updatedHoja }
      });
    } else {
      this.setState({ checks: {...this.state.checks, checkComodatos: false}, loading: false });
    }
  };

  render() {
    const { zonas, choferes, camiones, showDetalle, loading, movimientos, entregaComodatos } = this.state;

    const zonasOptions = zonas.map(z => ({
      label: z.zona_nombre,
      value: z.zona_id
    }));

    const choferesOptions = choferes.map(c => ({
      label: `${c.apellido.toUpperCase()}, ${c.nombre.toUpperCase()}`,
      value: c.chofer_id
    }));

    const camionesOptions = camiones.map(c => ({
      label: c.patente,
      value: c.camion_id
    }));

    return (
      <div className={styles.HojaForm}>
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.HojaSummary}>
            <div className={styles.HojaNumero}>
              <span>#</span> {this.getUpdatedHoja().hoja_ruta_numero}
            </div>
            <Input size='small' label='Fecha' name='fecha' onChange={this.onFieldChange}
                   value={moment(this.getUpdatedHoja().fecha).format('DD/MM/YYYY')} disabled/>
            <Select size='small' label='Zona' name='zona_id' placeholder='Seleccionar...'
                    value={this.getUpdatedHoja().zona_id}
                    options={zonasOptions} onChange={this.onFieldChange}/>
            <Select size='small' label='Chofer' name='chofer_id' placeholder='Seleccionar...'
                    value={this.getUpdatedHoja().chofer_id}
                    options={choferesOptions} onChange={this.onFieldChange}/>
            <Select size='small' label='Acompañante' name='acompanante_id' placeholder='Seleccionar...'
                    value={this.getUpdatedHoja().acompanante_id}
                    options={choferesOptions} onChange={this.onFieldChange}/>
            <Select size='small' label='Camion' name='camion_id' placeholder='Seleccionar...'
                    value={this.getUpdatedHoja().camion_id}
                    options={camionesOptions} onChange={this.onFieldChange}/>
            <Checkbox checked={entregaComodatos} name={'comodatos'} onChange={() => this.setState({entregaComodatos: !entregaComodatos})}>Entrega Comodatos</Checkbox>
            <div className={styles.EstadosWrapper}>
              <div
                className={classnames(styles.HojaEstado, this.getEstadoStock().style)}>
                {this.getEstadoStock().label}
              </div>
              <div
                className={classnames(styles.HojaEstado, this.getUpdatedHoja().estado ? styles.activo : styles.inactivo)}>
                {this.getUpdatedHoja().estado ? 'Abierta' : 'Cerrada'}
              </div>
            </div>
          </div>
          <div className={styles.HojaInfo}>
            <div className={styles.row}>
              <Input size='small' label='Km Inicial' name='km_inicial' onChange={this.onFieldChange}
                     value={this.getUpdatedHoja().km_inicial || ''}/>
              <Input size='small' label='Km Final' name='km_final' onChange={this.onFieldChange}
                     value={this.getUpdatedHoja().km_final || ''}/>
              <Input size='small' label='Canjes' name='canjes' onChange={this.onFieldChange}
                     value={this.getUpdatedHoja().canjes || ''}/>
            </div>
            <div className={styles.row}>
              <div className={styles.OpcionesPagoWrapper} style={{ width: '25%' }}>
                <div className={styles.OpcionesPagoTitle}>Condiciones de Pago</div>
                <div style={{ marginTop: 'calc(1.125rem + 7px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                    <div className={styles.label}>
                      Contado
                    </div>
                    <div className={styles.value}>
                      {numeral(calculateCondicionesPago('contado', movimientos)).format('$0,0.00')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div
                      style={{ display: 'flex', flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                      <div className={styles.label}>
                        No Contado
                      </div>
                      <div className={styles.value}>
                        {numeral(calculateCondicionesPago('no contado', movimientos)).format('$0,0.00')}
                      </div>
                    </div>
                    <i className="fas fa-search" onClick={() => this.setState({ showDetalle: true })}/>
                  </div>
                </div>
              </div>
              <div className={styles.OpcionesPagoWrapper}>
                <div className={styles.OpcionesPagoTitle}>Gastos</div>
                <Input size='small' label='Combustible' name='gasto_combustible' onChange={this.onFieldChange}
                       value={this.getUpdatedHoja().gasto_combustible || ''}/>
                <Input size='small' label='Viaticos' name='gasto_viatico' onChange={this.onFieldChange}
                       value={this.getUpdatedHoja().gasto_viatico || ''}/>
                <Input size='small' label='Otros' name='gasto_otro' onChange={this.onFieldChange}
                       value={this.getUpdatedHoja().gasto_otro || ''}/>
              </div>
              <div className={styles.OpcionesPagoWrapper}>
                <div className={styles.OpcionesPagoTitle}>Rendicion</div>
                <div style={{ marginTop: 'calc(1.125rem + 7px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                    <div className={styles.label}>
                      Contado
                    </div>
                    <div className={styles.value}>
                      {numeral(calculateCondicionesPago('contado', movimientos)).format('$0,0.00')}
                    </div>
                  </div>
                  <Input size='small' label='Cobranzas' name='cobranza' onChange={this.onFieldChange}
                         value={this.getUpdatedHoja().cobranza || ''}/>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'space-between',
                    marginTop: 'calc(1.125rem + 7px)'
                  }}>
                    <div className={styles.label}>
                      Gastos
                    </div>
                    <div className={styles.value}>
                      {numeral(calculateGastos(this.getUpdatedHoja())).format('$0,0.00')}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'space-between',
                    marginTop: 'calc(1.125rem + 7px)'
                  }}>
                    <div className={styles.label}>
                      Rendir
                    </div>
                    <div className={styles.value}>
                      {numeral(calculateRendicion(this.getUpdatedHoja(), movimientos)).format('$0,0.00')}
                    </div>
                  </div>
                  <Input size='small' label='Efectivo' name='efectivo' onChange={this.onFieldChange}
                         value={this.getUpdatedHoja().efectivo || ''}/>
                  <Input size='small' label='Cheques' name='cheques' onChange={this.onFieldChange}
                         value={this.getUpdatedHoja().cheques || ''}/>
                </div>
              </div>
              <div className={styles.OpcionesPagoWrapper} style={{width: '375px'}}>
                <div className={styles.OpcionesPagoTitle}>Controles</div>
                <div style={{ marginTop: 'calc(1.125rem + 7px)' }}>
                  {!this.state.checks.checkStock && <p className={styles.ControlText}>Realizar control de stock</p>}
                  {!this.state.checks.checkPedidos && <p className={styles.ControlText}>Controlar que los preruteos no entregados tengan motivo asignado</p>}
                  {!this.state.checks.checkRendicion && <p className={styles.ControlText}>Controlar que el efectivo rendido coincida con la suma de efectivo y cheques</p>}
                  {!this.state.checks.checkComodatos && <p className={styles.ControlText}>El chofer tiene comodatos que tiene que presentar</p>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className={styles.ButtonsWrapper}>
              <Button size='small' outline onClick={() => this.onSubmit(false)} disabled={!this.getUpdatedHoja().estado}>
                Guardar
              </Button>
              <Button size='small' type='primary' onClick={() => this.onSubmit(true)} disabled={!this.getUpdatedHoja().estado}>
                Cerrar
              </Button>
            </div>
          </div>
          <Modal
            show={showDetalle}
            onOk={() => this.setState({ showDetalle: false })}
            size='fit'
          >
            {this.renderCondiciones()}
          </Modal>
        </div>
      </div>
    );
  }
}
