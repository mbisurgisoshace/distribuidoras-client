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

import { ClientsSearch } from './ClientsSearch';

import {
  Hoja as IHoja,
  Precio as IPrecio,
  Envase as IEnvase,
  Chofer as IChofer,
  Cliente as ICliente,
  Comercio as IComercio,
  Movimiento as IPedido,
  MovimientoItem as IItem,
  CondicionVenta as ICondicionVenta
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

type IEditable<T> = { [P in keyof T]?: T[P] };

interface PedidoFormProps {
  nuevo?: boolean;
  pedido?: IPedido;
}

interface PedidoFormState {
  loading: boolean;
  cliente: ICliente;
  hojas: Array<IHoja>;
  comercio: IComercio;
  selectedTab: number;
  controlError: string;
  selectedEnvio: string;
  isAddingItem: boolean;
  pedidoGenerado: number;
  envases: Array<IEnvase>;
  precios: Array<IPrecio>;
  choferes: Array<IChofer>;
  pedidoConfirmado: boolean;
  comercios: Array<IComercio>;
  editableItem: IEditable<IItem>;
  toggleClientsSearchModal: boolean;
  editablePedido: IEditable<IPedido>;
  condicionesVenta: Array<ICondicionVenta>;
}

export class PedidoForm extends React.Component<PedidoFormProps, PedidoFormState> {
  constructor(props) {
    super(props);

    this.state = {
      hojas: [],
      envases: [],
      precios: [],
      choferes: [],
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
      pedidoGenerado: null,
      condicionesVenta: [],
      pedidoConfirmado: false,
      toggleClientsSearchModal: false
    };
  }

  async componentDidMount() {
    const envases = await EnvasesService.getEnvases();
    const choferes = await ChoferesService.getChoferes();
    const comercios = await ComerciosService.getComercios(true);
    const condicionesVenta = await CondicionesVentaService.getCondicionesVenta();
    const hojas = await HojasService.getHojasByFecha(moment().format('YYYY-MM-DD'));

    document.addEventListener('keypress', this.handleKeyPress);

    if (this.props.nuevo) {
      await this.createNewPedido();
    }

    this.setState({ hojas, envases, choferes, loading: false, comercios, condicionesVenta });
  }

  handleKeyPress = (e) => {
    const { isAddingItem, editableItem } = this.state;

    let keyCode = e.keyCode;

    if (keyCode === 112) {

    }

    if (keyCode === 13 && isAddingItem && editableItem.envase_id && editableItem.cantidad > 0) {
      this.addItem(true);
    }
  }

  createNewPedido = () => {
    const { editablePedido } = this.state;
    this.setState({
      editablePedido: {
        ...editablePedido,
        items: [],
        tipo_movimiento_id: 2,
        fecha: moment().format('DD-MM-YYYY')
      }
    });
  };

  onClientSelected = async (cliente) => {
    const { editablePedido } = this.state;
    const precios = await PreciosService.getListaPrecio(cliente.lista_precio_id);

    this.setState({
      cliente,
      precios,
      editablePedido: {
        ...editablePedido,
        cliente_id: cliente.cliente_id,
        condicion_venta_id: cliente.condicion_venta_id
      }
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

  onItemFieldChange = (e, index = null) => {
    let { editableItem = {}, editablePedido, precios } = this.state;

    if (e.target.name === 'envase_id') {
      let precio = 0;

      const precioArticulo = precios.find(p => p.envase_id === e.target.value);
      if (precioArticulo) {
        precio = precioArticulo.precio;
      }

      if (index !== null) {
        editablePedido.items[index] = {
          ...editablePedido.items[index],
          monto: precio
        };
      } else {
        editableItem = {
          ...editableItem,
          monto: precio
        };
      }
    }

    if (index !== null) {
      editablePedido.items[index] = {
        ...editablePedido.items[index],
        [e.target.name]: e.target.value
      };

      this.setState({
        editablePedido: {
          ...editablePedido
        }
      });
    } else {
      this.setState({
        editableItem: {
          ...editableItem,
          [e.target.name]: e.target.value
        }
      });
    }
  };

  onDeleteItem = (itemIndex) => {
    const { editablePedido } = this.state;
    editablePedido.items.splice(itemIndex, 1);

    this.setState({
      editablePedido: {
        ...editablePedido
      }
    });
  };

  getTotal = (cantidad, precio) => {
    return isNaN(cantidad * precio) ? 0 : cantidad * precio;
  };

  onSubmit = async () => {
    const { comercio, selectedTab, selectedEnvio, editablePedido } = this.state;

    if (selectedTab === 0 && selectedEnvio === 'dia') {
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

    const enc: IPedido = {
      visito: false,
      vendio: false,
      cliente_id: editablePedido.cliente_id,
      hoja_ruta_id: editablePedido.hoja_ruta_id,
      observaciones: editablePedido.observaciones,
      condicion_venta_id: editablePedido.condicion_venta_id,
      tipo_movimiento_id: editablePedido.tipo_movimiento_id,
      estado_movimiento_id: editablePedido.hoja_ruta_id !== null ? 1 : 2,
      fecha: moment(editablePedido.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }

    const newPedido = await MovimientosService.createPedido(enc);

    const det: Array<IItem> = editablePedido.items.map(i => ({
      movimiento_enc_id: newPedido.movimiento_enc_id,
      envase_id: i.envase_id,
      cantidad: i.cantidad,
      monto: i.cantidad * i.monto
    }));

    await MovimientosService.createMovimientoItems(newPedido.movimiento_enc_id, det);

    if (selectedTab === 1) {
      const pedido = {
        fecha: enc.fecha,
        comercio_id: comercio.id,
        movimiento_enc_id: newPedido.movimiento_enc_id,
        entregado: false,
        pagado: newPedido.condicion_venta_id === 3
      }

      await ComerciosService.createPedidoComercio(pedido);
    }

    if (newPedido.movimiento_enc_id) {
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
    }
  };

  onConfirmarPedido = () => {
    this.setState({
      pedidoGenerado: null,
      pedidoConfirmado: true
    })
  }

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
  }

  render() {
    const { nuevo } = this.props;
    const { hojas, cliente, envases, choferes, comercio, loading, isAddingItem, selectedTab, selectedEnvio, controlError, comercios, condicionesVenta, pedidoConfirmado, toggleClientsSearchModal } = this.state;

    const envasesOptions = envases.map(e => ({
      value: e.envase_id,
      label: e.envase_nombre
    }));

    const hojasOptions = hojas.map(h => {
      const chofer = choferes.find(c => c.chofer_id === h.chofer_id);
      return {
        label: `${startCase(chofer.apellido.toLowerCase())}, ${startCase(chofer.nombre.toLowerCase())}`,
        value: h.hoja_ruta_id
      };
    });

    const condicionesVentaOptions = condicionesVenta.map(c => ({
      label: c.condicion_venta_nombre,
      value: c.condicion_venta_id
    }));

    const filteredComercios = this.filterComercios();

    console.log('filteredComercios', filteredComercios);

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
                    <svg className={styles.Icons} onClick={() => this.setState({ toggleClientsSearchModal: true })}>
                      <use xlinkHref={`/assets/images/sprite.svg#icon-users-solid`}></use>
                    </svg>
                    <svg className={styles.Icons} onClick={() => window.open('/clientes/new', '_blank')}>
                      <use xlinkHref={`/assets/images/sprite.svg#icon-user-plus-solid`}></use>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.ClienteDetailsFieldWrapper}>
                      <div className={styles.ClienteDetailsField}>
                        <span>Razon Social:</span>
                        <p>{cliente && cliente.razon_social || ''}</p>
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        <span>Domicilio:</span>
                        <p>{`${cliente && cliente.calle || ''} ${cliente && cliente.altura || ''}`.trim()}</p>
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        <span>Telefono:</span>
                        <p>{cliente && cliente.telefono || ''}</p>
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
                <div className={styles.DetalleWrapper}>
                  <div className={styles.DetalleWrapperHeader}>
                    <h3>Detalle Pedido</h3>
                    <svg className={styles.Icons} onClick={() => this.addItem(false)}>
                      <use xlinkHref={`/assets/images/sprite.svg#icon-plus-solid`}></use>
                    </svg>
                  </div>
                  {this.getUpdatedPedido().items && this.getUpdatedPedido().items.map((i, index) => (
                    <div className={classnames(styles.row, styles.ItemWrapper)} key={index}>
                      <Select size='small' name='envase_id' placeholder='Producto...'
                              value={this.getUpdatedPedido().items[index].envase_id} options={envasesOptions}
                              onChange={(e) => this.onItemFieldChange(e, index)}
                              className={styles.ItemSelectContainer}
                      />
                      <Input size='small' placeholder='Cantidad' name='cantidad'
                             onChange={(e) => this.onItemFieldChange(e, index)}
                             value={this.getUpdatedPedido().items[index].cantidad}
                             className={styles.ItemInputContainer}
                      />
                      <Input disabled size='small' placeholder='Precio' name='monto'
                             onChange={(e) => this.onItemFieldChange(e, index)}
                             value={numeral(this.getUpdatedPedido().items[index].monto).format('$0,0.00')}
                             className={styles.ItemInputContainer}
                      />
                      <Input disabled size='small' placeholder='Monto' name='monto' onChange={this.onItemFieldChange}
                             value={numeral(this.getTotal(this.getUpdatedPedido().items[index].cantidad, this.getUpdatedPedido().items[index].monto)).format('$0,0.00')}
                             className={styles.ItemInputContainer}
                      />
                      <svg className={styles.Icons} onClick={() => this.onDeleteItem(index)}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-ban-solid`}></use>
                      </svg>
                    </div>
                  ))}
                  {isAddingItem && (
                    <div className={classnames(styles.row, styles.ItemWrapper, styles.newItem)}>
                      <Select size='small' name='envase_id' placeholder='Producto...'
                              value={this.getUpdatedItem().envase_id} options={envasesOptions}
                              onChange={this.onItemFieldChange}
                              className={styles.ItemSelectContainer}
                      />
                      <Input size='small' placeholder='Cantidad' name='cantidad' onChange={this.onItemFieldChange}
                             value={this.getUpdatedItem().cantidad}
                             className={styles.ItemInputContainer}
                      />
                      <Input disabled size='small' placeholder='Precio' name='monto' onChange={this.onItemFieldChange}
                             value={numeral(this.getUpdatedItem().monto).format('$0,0.00')}
                             className={styles.ItemInputContainer}
                      />
                      <Input disabled size='small' placeholder='Monto' name='monto' onChange={this.onItemFieldChange}
                             value={numeral(this.getTotal(this.getUpdatedItem().cantidad, this.getUpdatedItem().monto)).format('$0,0.00')}
                             className={styles.ItemInputContainer}
                      />
                      <svg className={styles.Icons} onClick={() => this.addItem(true)}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-check-solid`}></use>
                      </svg>
                      <svg className={styles.Icons}
                           onClick={() => this.setState({ isAddingItem: false, editableItem: {} })}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-ban-solid`}></use>
                      </svg>
                    </div>
                  )}
                </div>
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
                onSelect={(selectedTab) => this.setState({selectedTab})}
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
                             onChange={() => this.setState({selectedEnvio: 'dia'})}
                      />
                      En el día
                    </label>
                    <label>
                      <input type="radio" value="programado"
                             checked={selectedEnvio === 'programado'}
                             onChange={() => this.setState({selectedEnvio: 'programado'})}
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
                  {controlError && <p className={styles.ControlText}>{controlError}</p>}
                </TabPanel>
                <TabPanel>
                  <div style={{width: '100%', height: '350px', marginBottom: '10px'}}>
                    <PuntoEntregaMap
                      lat={cliente && cliente.latitud}
                      lng={cliente && cliente.longitud}
                      comercios={filteredComercios}
                      onSelectComercio={(comercio) => this.setState({comercio})}
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

          {toggleClientsSearchModal && (
            <ClientsSearch
              onClose={() => this.setState({
                toggleClientsSearchModal: false
              })}
              onSelectClient={this.onClientSelected}
            />
          )}

          <Modal
            size={'small'}
            show={this.state.pedidoGenerado !== null}
            onOk={this.onConfirmarPedido}
          >
            <div style={{height: '100%', padding: '1rem'}}>
              {`El pedido fue generado exitosamente. El número de pedido es el ${this.state.pedidoGenerado}. ${this.state.pedidoGenerado && selectedTab === 1 && `Puede retirar su pedido por el punto de entrega ${comercio.razon_social}. La direccion es ${comercio.calle} ${comercio.altura}. El telefono es ${comercio.telefono}.`}`}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
