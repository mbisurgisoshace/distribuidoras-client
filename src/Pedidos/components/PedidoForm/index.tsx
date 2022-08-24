import * as React from 'react';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { startCase } from 'lodash';
import * as turf from '@turf/turf';
import * as classnames from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import * as styles from './styles.css';

import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { DatePicker } from '../../../shared/components/DatePicker';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';

import {
  Hoja as IHoja,
  Canal as ICanal,
  Precio as IPrecio,
  Envase as IEnvase,
  Chofer as IChofer,
  Cliente as ICliente,
  Subzona as ISubZona,
  Comercio as IComercio,
  Movimiento as IPedido,
  MovimientoItem as IItem,
  CondicionVenta as ICondicionVenta,
  TipoMovimiento as ITipoMovimiento
} from '../../../types';

import HojasService from '../../../services/hojas';
import EnvasesService from '../../../services/envases';
import PreciosService from '../../../services/precios';
import ChoferesService from '../../../services/choferes';
import CondicionesVentaService from '../../../services/condicionesVenta';
import ClienteMap from '../../../Clientes/components/ClienteForm/ClienteMap';
import { Button } from '../../../shared/components/Button';
import MovimientosService from '../../../services/movimientos';
import { Modal } from '../../../shared/components/Modal';
import ComerciosService from '../../../services/comercios';
import PuntoEntregaMap from './PuntoEntregaMap';
import { ClientsInputSearch } from '../../../shared/components/ClientsInputSearch/ClientsInputSearch';
import ClientesService from '../../../services/clientes';
import CanalesService from '../../../services/canales';
import SubzonasService from '../../../services/subzonas';
import { FormDetail } from './FormDetail';
import TiposMovimientoService from '../../../services/tiposMovimiento';
import EstadosMovimientoService from '../../../services/estadosMovimiento';
import toastNotify from '../../../shared/components/ToastNotification';
import TablasService from '../../../services/TablasService';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface PedidoFormProps {
  nuevo?: boolean;
  pedido?: IPedido;
}

interface PedidoFormState {
  loading: boolean;
  hojas: Array<IHoja>;
  comercio: IComercio;
  selectedTab: number;
  controlError: string;
  selectedEnvio: string;
  isAddingItem: boolean;
  pedidoGenerado: number;
  editarCliente: boolean;
  canales: Array<ICanal>;
  envases: Array<IEnvase>;
  precios: Array<IPrecio>;
  choferes: Array<IChofer>;
  clientes: Array<ICliente>;
  pedidoConfirmado: boolean;
  subzonas: Array<ISubZona>;
  comercios: Array<IComercio>;
  cliente: IEditable<ICliente>;
  tipos: Array<ITipoMovimiento>;
  editableItem: IEditable<IItem>;
  editablePedido: IEditable<IPedido>;
  estadosMovimiento: Array<any>;
  condicionesVenta: Array<ICondicionVenta>;
}

export class PedidoForm extends React.Component<PedidoFormProps, PedidoFormState> {
  formDetailRef;

  constructor(props) {
    super(props);

    this.formDetailRef = React.createRef();

    this.state = {
      hojas: [],
      tipos: [],
      envases: [],
      precios: [],
      canales: [],
      choferes: [],
      clientes: [],
      subzonas: [],
      cliente: null,
      loading: true,
      comercios: [],
      comercio: null,
      selectedTab: 0,
      editableItem: {},
      controlError: '',
      editablePedido: {},
      isAddingItem: false,
      selectedEnvio: 'dia',
      editarCliente: false,
      pedidoGenerado: null,
      condicionesVenta: [],
      pedidoConfirmado: false,
      estadosMovimiento: []
    };
  }

  async componentDidMount() {
    const tablas:any = await TablasService.getTablas(
      'envases,subzonas,canales,condicionesVenta,estadosMovimiento,tiposMovimiento'
    )

    // const envases = await EnvasesService.getEnvases();
    // const canales = await CanalesService.getCanales();
    // const subzonas = await SubzonasService.getSubzonas();
    const envases = tablas.envases;
    const canales = tablas.canales;
    const subzonas = tablas.subzonas;
    const clientes = await ClientesService.getClientes();
    const choferes = await ChoferesService.getChoferes();
    //const tipos = await TiposMovimientoService.getTiposMovimiento();
    const tipos = tablas.tiposMovimiento;
    //const comercios = await ComerciosService.getComercios(true);
    //const condicionesVenta = await CondicionesVentaService.getCondicionesVenta();
    const condicionesVenta = tablas.condicionesVenta;
    //const estadosMovimiento = await EstadosMovimientoService.getEstadosMovimiento();
    const estadosMovimiento = tablas.estadosMovimiento;
    
    const hojas = await HojasService.getHojasByEstado(1);

    document.addEventListener('keypress', this.handleKeyPress);

    if (this.props.nuevo) {
      await this.createNewPedido();
    } else {
      await this.setPedido(clientes);
    }

    this.setState({
      hojas,
      tipos,
      clientes,
      envases,
      canales,
      subzonas,
      choferes,
      loading: false,
      //comercios,
      condicionesVenta,
      estadosMovimiento
    });
  }

  handleKeyPress = (e) => {
    const { isAddingItem, editableItem } = this.state;

    let keyCode = e.keyCode;

    if (keyCode === 112) {

    }

    if (keyCode === 13 && isAddingItem && editableItem.envase_id && editableItem.cantidad > 0) {
      this.addItem(true);
    }
  };

  createNewPedido = () => {
    const { editablePedido } = this.state;
    this.setState({
      editablePedido: {
        ...editablePedido,
        items: [],
        tipo_movimiento_id: 2,
        estado_movimiento_id: 2,
        fecha: moment().format('DD-MM-YYYY')
      }
    });
  };

  setPedido = async (clientes) => {
    let precios = [];
    const cliente = clientes.find(cliente => cliente.cliente_id === this.props.pedido.cliente_id);

    if (cliente) {
      precios = await PreciosService.getListaPrecio(cliente.lista_precio_id);
    }

    this.setState({
      cliente,
      precios,
      editablePedido: {
        ...this.props.pedido,
        fecha: moment(this.props.pedido.fecha).utc().format('DD-MM-YYYY')
      }
    })
  }

  onClientSelected = async (cliente) => {
    const { editablePedido, hojas, subzonas } = this.state;

    const subzona = subzonas.find(sub => sub.sub_zona_id === cliente.zona_sub_id);
    const hoja = hojas.find(hoj => hoj.zona_id === subzona.zona_id);
    const precios = await PreciosService.getListaPrecio(cliente.lista_precio_id);
    //const ultimoPedido = await ClientesService.getLastPedidoCliente(cliente.cliente_id);
    //console.log('precios', precios);
    //console.log('ultimoPedido', ultimoPedido);
    // const preciosUltimoPedido = ultimoPedido.items.map(item => ({
    //   envase_id: item.envase_id,
    //   precio: item.precio
    // }))

    this.setState({
      cliente,
      editablePedido: {
        ...editablePedido,
        cliente_id: cliente.cliente_id,
        hoja_ruta_id: hoja ? hoja.hoja_ruta_id : null,
        condicion_venta_id: cliente.condicion_venta_id
      },
      //precios: preciosUltimoPedido,
      precios
    });
  };

  onFieldChange = (e) => {
    const { editablePedido = {} } = this.state;
    this.setState({
      editablePedido: {
        ...editablePedido,
        [e.target.name]: e.target.value
      }
    });
  };

  getUpdatedItem = () => {
    const { editableItem = {} } = this.state;

    return {
      ...editableItem
    };
  };

  getUpdatedPedido = () => {
    const { pedido } = this.props;
    const { editablePedido = {} } = this.state;

    return {
      ...pedido,
      ...editablePedido
    };
  };

  addItem = (isDone: boolean) => {
    const { editableItem, editablePedido } = this.state;

    if (isDone) {
      editablePedido.items.push(editableItem);

      this.setState({
        editableItem: {},
        isAddingItem: false,
        editablePedido: {
          ...editablePedido
        }
      });
    } else {
      this.setState({
        editableItem: {},
        isAddingItem: true
      });
    }
  };

  onSubmit = async () => {
    try {
      const { comercio, selectedTab, selectedEnvio, editablePedido } = this.state;

      if (selectedTab === 0 && selectedEnvio === 'dia' && this.props.nuevo) {
        const fecha = moment().format('YYYY-MM-DD');
        const fechaPedido = moment(editablePedido.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (fecha !== fechaPedido) {
          this.setState({
            controlError: 'La fecha del pedido tiene que ser igual a la fecha de hoy.'
          });
          return;
        }
      }

      if (selectedTab === 0 && selectedEnvio === 'programado') {
        const fecha = moment().format('YYYY-MM-DD');
        const fechaPedido = moment(editablePedido.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (fecha === fechaPedido) {
          this.setState({
            controlError: 'La fecha del pedido tiene que ser mayor a la fecha de hoy.'
          });
          return;
        }
      }

      if (selectedTab === 1) {
        if (!comercio) {
          this.setState({
            controlError: 'Debe seleccionar un punto de entrega para el cliente.'
          });
          return;
        }
      }

      let items = [];

      if (this.formDetailRef && this.formDetailRef.current) {
        items = this.formDetailRef.current.getItems().filter(i => i.envase_id !== '').map(i => ({
          movimiento_enc_id: i?.movimiento_enc_id,
          movimiento_det_id: i?.movimiento_det_id,
          envase_id: i.envase_id,
          cantidad: numeral(i.cantidad).value() || 0,
          monto: numeral(i.precio).value() || 0
        }))
      }

      const enc: IPedido = {
        visito: false,
        vendio: false,
        cliente_id: editablePedido.cliente_id,
        hoja_ruta_id: editablePedido.hoja_ruta_id,
        observaciones: editablePedido.observaciones,
        condicion_venta_id: editablePedido.condicion_venta_id,
        tipo_movimiento_id: editablePedido.tipo_movimiento_id,
        estado_movimiento_id: editablePedido.estado_movimiento_id,
        fecha: moment(editablePedido.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
      };

      if (this.props.nuevo) {
        const newPedido = await MovimientosService.createPedido(enc);

        const det: Array<IItem> = items.map(i => ({
          movimiento_enc_id: newPedido.movimiento_enc_id,
          envase_id: i.envase_id,
          cantidad: i.cantidad,
          monto: i.cantidad * i.monto
        }));

        await MovimientosService.createMovimientoItems(newPedido.movimiento_enc_id, det);

        this.setState({
          controlError: '',
          editablePedido: {
            ...editablePedido,
            items: [],
            tipo_movimiento_id: 2,
            fecha: moment().format('DD-MM-YYYY')
          },
          pedidoGenerado: newPedido.movimiento_enc_id
        });

        toastNotify.success({
          header: 'Pedido creado correctamente.'
        })
      } else {
        const updatedPedido = await MovimientosService.updatePedido(enc, editablePedido.movimiento_enc_id);
        console.log('updatedPedido', updatedPedido);

        const det: Array<IItem> = items.map(i => ({
          movimiento_enc_id: updatedPedido.movimiento_enc_id,
          movimiento_det_id: i?.movimiento_det_id,
          envase_id: i.envase_id,
          cantidad: i.cantidad,
          monto: i.cantidad * i.monto
        }));

        await MovimientosService.updateMovimientoItems(updatedPedido.movimiento_enc_id, det);

        this.setState({
          controlError: ''
        });

        toastNotify.success({
          header: 'Pedido actualizado correctamente.'
        })
      }
    } catch (err) {
      toastNotify.error({
        header: 'Ha ocurrido un error.'
      })
    }
  };

  onConfirmarPedido = () => {
    this.setState({
      pedidoGenerado: null,
      pedidoConfirmado: true
    });
  };

  filterComercios = () => {
    const { cliente, comercios, editablePedido } = this.state;

    if (!cliente) return [];
    const radius = turf.circle([cliente.latitud, cliente.longitud], 0.5);

    return comercios.filter(c => {
      let stock = true;
      const distance = turf.booleanPointInPolygon([c.latitud, c.longitud], radius);

      editablePedido.items.forEach(i => {
        const stockEnvase = c.stock.find(s => s.envase_id === i.envase_id);
        if (!stockEnvase || stockEnvase.cantidad < i.cantidad) stock = false;
      });

      return stock && distance;
    });
  };

  saveCliente = async () => {
    const { cliente } = this.state;

    await ClientesService.updateCliente(cliente, cliente.cliente_id);

    this.setState({
      editarCliente: false
    });
  };

  getUpdatedCliente = () => {
    const { cliente = {} } = this.state;

    return {
      ...cliente
    };
  };

  onClienteFieldChange = (e) => {
    const { cliente = {} } = this.state;

    this.setState({
      cliente: {
        ...cliente,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    const { nuevo } = this.props;
    const { hojas, tipos, cliente, envases, clientes, choferes, comercio, canales, subzonas, loading, editarCliente, isAddingItem, selectedTab, selectedEnvio, controlError, condicionesVenta, pedidoConfirmado, estadosMovimiento } = this.state;
    console.log('editablePedido', this.getUpdatedPedido());

    const envasesOptions = envases.map(e => ({
      value: e.envase_id,
      label: e.envase_nombre
    }));

    const hojasOptions = hojas.map(h => {
      const chofer = choferes.find(c => c.chofer_id === h.chofer_id);
      return {
        label: `${startCase(chofer.apellido.toLowerCase())}, ${startCase(chofer.nombre.toLowerCase())} - ${h.hoja_ruta_numero}`,
        value: h.hoja_ruta_id
      };
    });

    hojasOptions.unshift({
      label: 'Sin chofer',
      value: null
    });

    const condicionesVentaOptions = condicionesVenta.map(c => ({
      label: c.condicion_venta_nombre,
      value: c.condicion_venta_id
    }));

    const subzonasOptions = subzonas.map(s => ({
      label: s.sub_zona_nombre,
      value: s.sub_zona_id
    }));

    const canalesOptions = canales.map(c => ({
      label: c.canal_nombre,
      value: c.canal_id
    }));

    const tiposOptions = tipos.map(t => ({
      label: t.tipo_movimiento_nombre,
      value: t.tipo_movimiento_id
    }));

    const estadosOptions = estadosMovimiento.map(e => ({
      label: e.estado_movimiento_nombre,
      value: e.estado_movimiento_id
    }))

    const filteredComercios = this.filterComercios();
    console.log('this.get', this.getUpdatedPedido());
    return (
      <div className={styles.PedidoForm}>
        {nuevo && pedidoConfirmado && window.location.reload(false)}
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.PedidoSummary}>
            <div className={styles.PedidoId}>
              <span>#</span> {this.getUpdatedPedido().movimiento_enc_id}
            </div>
          </div>
          <div className={styles.PedidoInfo}>
            <div className={styles.PedidoInfoLeft}>
              <div className={styles.row}>
                <DatePicker
                  size='small'
                  value={this.getUpdatedPedido().fecha || moment().format('DD-MM-YYYY')}
                  name='fecha'
                  label={'Fecha'}
                  onChange={this.onFieldChange}/>
              </div>
              <div className={styles.row}>
                <div className={styles.ClienteWrapper}>
                  <div className={styles.ClienteWrapperHeader}>
                    <h3>Cliente</h3>
                    <ClientsInputSearch clientes={clientes}
                                        onSelectClient={(cliente) => this.onClientSelected(cliente)}/>
                    <Button size={'tiny'} onClick={() => window.open('/clientes/new', '_blank')}>Nuevo</Button>
                    <Button
                      size={'tiny'}
                      type={editarCliente ? 'secondary' : 'primary'}
                      disabled={!cliente}
                      onClick={() => {
                        editarCliente ? this.saveCliente() : this.setState({ editarCliente: true });
                      }}>
                      {editarCliente ? 'Guardar' : 'Editar'}
                    </Button>
                  </div>
                  <div>
                    <div className={styles.ClienteDetailsFieldWrapper}>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <Input size='small' label='Razon Social' name='razon_social' fluid
                                 onChange={this.onClienteFieldChange}
                                 value={this.getUpdatedCliente().razon_social}/>
                        ) : (
                          <>
                            <span>Razon Social:</span>
                            <p>{cliente && this.getUpdatedCliente().razon_social || ''}</p>
                          </>
                        )}
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <>
                            <Input size='small' label='Calle' name='calle' fluid onChange={this.onClienteFieldChange}
                                   value={this.getUpdatedCliente().calle}/>
                            <div style={{ width: '5px' }}/>
                            <Input size='small' label='Altura' name='altura' onChange={this.onClienteFieldChange}
                                   value={this.getUpdatedCliente().altura}/>
                          </>
                        ) : (
                          <>
                            <span>Domicilio:</span>
                            <p>{`${cliente && this.getUpdatedCliente().calle || ''} ${cliente && this.getUpdatedCliente().altura || ''}`.trim()}</p>
                          </>
                        )}
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <Input size='small' label='Telefono' name='telefono' fluid onChange={this.onClienteFieldChange}
                                 value={this.getUpdatedCliente().telefono}/>
                        ) : (
                          <>
                            <span>Telefono:</span>
                            <p>{cliente && cliente.telefono || ''}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={styles.ClienteDetailsFieldWrapper}>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <Select size='small' label='Canal' name='canal_id' placeholder='Seleccionar...'
                                  value={this.getUpdatedCliente().canal_id || 1}
                                  fluid
                                  options={canalesOptions} onChange={this.onClienteFieldChange}/>
                        ) : (
                          <>
                            <span>Canal:</span>
                            <p>{cliente && canales.find(c => c.canal_id === cliente.canal_id)?.canal_nombre || ''}</p>
                          </>
                        )}
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <Select size='small' label='Sub Zona' name='zona_sub_id' placeholder='Seleccionar...'
                                  value={this.getUpdatedCliente().zona_sub_id} options={subzonasOptions}
                                  fluid
                                  onChange={this.onClienteFieldChange}/>
                        ) : (
                          <>
                            <span>Zona:</span>
                            <p>{cliente && subzonas.find(s => s.sub_zona_id === cliente.zona_sub_id)?.sub_zona_nombre || ''}</p>
                          </>
                        )}
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        {editarCliente ? (
                          <Select size='small' label='Condicion de Venta' name='condicion_venta_id'
                                  placeholder='Seleccionar...'
                                  value={this.getUpdatedCliente().condicion_venta_id || 1}
                                  fluid
                                  options={condicionesVentaOptions}
                                  onChange={this.onClienteFieldChange}/>
                        ) : (
                          <>
                            <span>Condicion de Venta:</span>
                            <p>{cliente && condicionesVenta.find(c => c.condicion_venta_id === cliente.condicion_venta_id)?.condicion_venta_nombre || ''}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                      <ClienteMap
                        onlyView
                        lat={cliente && cliente.latitud}
                        lng={cliente && cliente.longitud}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <FormDetail
                  ref={this.formDetailRef}
                  precios={this.state.precios}
                  items={this.getUpdatedPedido()?.items?.map(i => ({
                    ...i,
                    precio: i.monto / i.cantidad
                  }))}
                  envases={envases.map(e => ({value: e.envase_id, label: e.envase_nombre}))}
                />
              </div>
              <div className={styles.row}>
                <Select
                  size='small'
                  name='condicion_venta_id'
                  placeholder={'Condicion de Venta...'}
                  value={this.getUpdatedPedido().condicion_venta_id} options={condicionesVentaOptions}
                  onChange={this.onFieldChange}
                  className={styles.ItemSelectContainer}
                />

                <Input
                  size='small'
                  label={'Observaciones'}
                  name='observaciones'
                  fluid
                  onChange={this.onFieldChange}
                  value={this.getUpdatedPedido().observaciones}
                  className={classnames(styles.ItemInputContainer, styles.margin)}
                />
              </div>
            </div>
            <div className={styles.PedidoInfoRight}>
              <Tabs
                selectedIndex={selectedTab}
                onSelect={(selectedTab) => this.setState({ selectedTab })}
              >
                <TabList>
                  <Tab>Envío</Tab>
                  <Tab>Retiro</Tab>
                </TabList>
                <TabPanel>
                  <div className={styles.EnvioOpcionesWrapper}>
                    <label>
                      <input type="radio" value="dia"
                             checked={selectedEnvio === 'dia'}
                             onChange={() => this.setState({ selectedEnvio: 'dia' })}
                      />
                      En el día
                    </label>
                    <label>
                      <input type="radio" value="programado"
                             checked={selectedEnvio === 'programado'}
                             onChange={() => this.setState({ selectedEnvio: 'programado' })}
                      />
                      Programado
                    </label>
                  </div>
                  <Select
                    size='small'
                    name='hoja_ruta_id'
                    label={'Asignar a Chofer'}
                    placeholder={'Chofer...'}
                    value={this.getUpdatedPedido().hoja_ruta_id} options={hojasOptions}
                    onChange={this.onFieldChange}
                    className={styles.ItemSelectContainer}
                  />
                  <Select
                    size='small'
                    name='tipo_movimiento_id'
                    label={'Tipo de Movimiento'}
                    placeholder={'Tipo...'}
                    value={this.getUpdatedPedido().tipo_movimiento_id} options={tiposOptions}
                    onChange={this.onFieldChange}
                    className={styles.ItemSelectContainer}
                  />
                  <Select
                    size='small'
                    name='estado_movimiento_id'
                    label={'Estado de Movimiento'}
                    placeholder={'Estado...'}
                    value={this.getUpdatedPedido().estado_movimiento_id} options={estadosOptions}
                    onChange={this.onFieldChange}
                    className={styles.ItemSelectContainer}
                  />
                  {controlError && <p className={styles.ControlText}>{controlError}</p>}
                </TabPanel>
                <TabPanel>
                  <div style={{ width: '100%', height: '350px', marginBottom: '10px' }}>
                    <PuntoEntregaMap
                      lat={cliente && cliente.latitud}
                      lng={cliente && cliente.longitud}
                      comercios={filteredComercios}
                      onSelectComercio={(comercio) => this.setState({ comercio })}
                    />
                  </div>
                  <div className={styles.ComercioDetailsField}>
                    <span>Razon Social:</span>
                    <p>{comercio && comercio.razon_social || ''}</p>
                  </div>
                  <div className={styles.ComercioDetailsField}>
                    <span>Domicilio:</span>
                    <p>{`${comercio && comercio.calle || ''} ${comercio && comercio.altura || ''}`.trim()}</p>
                  </div>
                  <div className={styles.ComercioDetailsField}>
                    <span>Telefono:</span>
                    <p>{comercio && comercio.telefono || ''}</p>
                  </div>
                </TabPanel>
              </Tabs>

              <Button disabled={!this.getUpdatedPedido().cliente_id} size='small' outline onClick={this.onSubmit}>
                Guardar
              </Button>
            </div>
          </div>
          {this.props.nuevo && (
            <Modal
              size={'small'}
              show={this.state.pedidoGenerado !== null}
              onOk={this.onConfirmarPedido}
            >
              <div style={{ height: '100%', padding: '1rem' }}>
                {`El pedido fue generado exitosamente. El número de pedido es el ${this.state.pedidoGenerado}.`}
              </div>
            </Modal>
          )}
        </div>
      </div>
    );
  }
}
