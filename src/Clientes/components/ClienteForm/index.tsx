import * as React from 'react';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as classnames from 'classnames';
import { Link, Redirect } from 'react-router-dom';

import * as styles from './styles.css';

import ClienteMap from './ClienteMap';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/Select';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';

import {
  Zona as IZona,
  Canal as ICanal,
  Cliente as ICliente,
  Subzona as ISubzona,
  ListaPrecio as IListaPrecio,
  CondicionIva as ICondicionIva,
  CondicionVenta as ICondicionVenta,
  UltimoPedidoView as IUltimoPedidoView
} from '../../../types';

import ZonasService from '../../../services/zonas';
import PreciosService from '../../../services/precios';
import CanalesService from '../../../services/canales';
import ClientesService from '../../../services/clientes';
import SubzonasService from '../../../services/subzonas';
import CondicionesIvaService from '../../../services/condicionesIva';
import CondicionesVentaService from '../../../services/condicionesVenta';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface ClienteFormProps {
  nuevo?: boolean;
  cliente?: ICliente
  ultimoPedido?: IUltimoPedidoView
}

interface ClienteFormState {
  editableCliente: IEditable<ICliente>;
  zonas: Array<IZona>;
  selectedZonaId: number;
  canales: Array<ICanal>;
  subzonas: Array<ISubzona>;
  listasPrecio: Array<IListaPrecio>;
  condicionesIva: Array<ICondicionIva>;
  condicionesVenta: Array<ICondicionVenta>;
  loading: boolean;
}

export class ClienteForm extends React.Component<ClienteFormProps, ClienteFormState> {
  constructor(props) {
    super(props);

    this.state = {
      editableCliente: {},
      zonas: [],
      canales: [],
      subzonas: [],
      listasPrecio: [],
      condicionesIva: [],
      condicionesVenta: [],
      selectedZonaId: null,
      loading: true
    };
  }

  async componentDidMount() {
    const zonas = await ZonasService.getZonas();
    const canales = await CanalesService.getCanales();
    const subzonas = await SubzonasService.getSubzonas();
    const listasPrecio = await PreciosService.getListasPrecio();
    const condicionesIva = await CondicionesIvaService.getCondicionesIva();
    const condicionesVenta = await CondicionesVentaService.getCondicionesVenta();

    if (this.props.nuevo) {
      await this.createNewCliente();
    }

    this.setState({ zonas, canales, subzonas, listasPrecio, condicionesIva, condicionesVenta, loading: false });
  }

  createNewCliente = () => {
    const { editableCliente } = this.state;
    this.setState({
      editableCliente: {
        ...editableCliente,
        condicion_iva_id: 1,
        condicion_venta_id: 1,
        canal_id: 1
      }
    });
  };

  onSetCoords = (lat, lng) => {
    const { editableCliente = {} } = this.state;

    editableCliente.latitud = lat;
    editableCliente.longitud = lng;

    this.setState({ editableCliente: { ...editableCliente } });
  };

  onLocationChanged = (lat, lng, calle, altura, localidad, codigoPostal, provincia) => {
    const { editableCliente = {} } = this.state;

    if (calle) {
      editableCliente.calle = calle;
    }

    if (altura) {
      editableCliente.altura = altura;
    }

    if (localidad) {
      editableCliente.localidad = localidad;
    }

    if (codigoPostal) {
      editableCliente.codigo_postal = codigoPostal;
    }

    // if (provincia) {
    //   editableCliente['provincia'] = provincia;
    // }

    editableCliente.latitud = lat;
    editableCliente.longitud = lng;

    this.setState({ editableCliente: { ...editableCliente } });
  };

  onFieldChange = (e) => {
    const { editableCliente = {} } = this.state;
    this.setState({
      editableCliente: {
        ...editableCliente,
        [e.target.name]: e.target.value
      }
    });
  };

  onZonaChange = (e) => {
    const selectedZonaId = e.target.value;
    const subzonas = this.state.subzonas.filter(s => s.zona_id === selectedZonaId);
    this.setState({ subzonas, selectedZonaId });
  };

  getUpdatedCliente = () => {
    const { cliente } = this.props;
    const { editableCliente = {} } = this.state;

    return {
      ...cliente,
      ...editableCliente
    };
  };

  calculateDias = (fecha) => {
    const hoy = moment();
    const ultima = moment(fecha);

    return hoy.diff(ultima, 'days');
  };

  getClassDias = (dias: number) => {
    if (dias <= 7) {
      return styles.low;
    }

    if (dias > 7 && dias <= 21) {
      return styles.medium;
    }

    if (dias > 21) {
      return styles.large;
    }
  };

  onSubmit = async () => {
    this.setState({ loading: true });
    const cliente = this.getUpdatedCliente();

    if (this.props.cliente) {
      const updatedCliente = await ClientesService.updateCliente(cliente, cliente.cliente_id);
      this.setState({ loading: false, editableCliente: { ...updatedCliente } });
    } else {
      const newCliente = await ClientesService.createCliente(cliente);
      this.setState({ loading: false, editableCliente: { ...newCliente } });
    }
  };

  render() {
    const { nuevo, ultimoPedido } = this.props;
    const { zonas, canales, subzonas, selectedZonaId, listasPrecio, condicionesIva, condicionesVenta, loading } = this.state;

    const zonasOptions = zonas.map(z => ({
      label: z.zona_nombre,
      value: z.zona_id
    }));

    const subzonasOptions = subzonas.map(s => ({
      label: s.sub_zona_nombre,
      value: s.sub_zona_id
    }));

    const canalesOptions = canales.map(c => ({
      label: c.canal_nombre,
      value: c.canal_id
    }));

    const listasPrecioOptions = listasPrecio.map(p => ({
      label: p.lista_precio_nombre,
      value: p.lista_precio_id
    }));

    const condicionesIvaOptions = condicionesIva.map(c => ({
      label: c.condicion_iva_nombre,
      value: c.condicion_iva_id
    }));

    const condicionesVentaOptions = condicionesVenta.map(c => ({
      label: c.condicion_venta_nombre,
      value: c.condicion_venta_id
    }));

    return (
      <div className={styles.ClienteForm}>
        {nuevo && this.getUpdatedCliente().cliente_id &&
        <Redirect to={`/clientes/${this.getUpdatedCliente().cliente_id}`}/>}
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.ClienteSummary}>
            <div className={styles.ClienteCodigo}>
              <span>#</span> {this.getUpdatedCliente().cliente_id}
            </div>
            {this.getUpdatedCliente().fecha_ultima_compra && (
              <div className={styles.ClienteUltimoPedido}>
                <div
                  className={classnames(styles.DiasUltimaCompra, this.getClassDias(this.calculateDias(this.getUpdatedCliente().fecha_ultima_compra)))}>
                  {this.calculateDias(this.getUpdatedCliente().fecha_ultima_compra)}
                </div>
                <div className={styles.UltimoPedido}>
                  <div className={styles.UltimoPedidoTitulo}>Ultimo Pedido</div>
                  <div className={styles.UltimoPedidoNumero}>
                    <span>#</span>
                    <Link to={`/pedidos/${ultimoPedido.pedido_id}`} target='_blank'>
                      {ultimoPedido.pedido_id}
                      <div className={styles.UltimoPedidoResumen}>
                        <div className={styles.header}>
                          <div style={{ width: '45px' }}>Cod</div>
                          <div style={{ width: '150px' }}>Producto</div>
                          <div style={{ width: '45px' }}>Cant</div>
                          <div style={{ width: '60px' }}>Precio</div>
                        </div>
                        {ultimoPedido.items.map(i => (
                          <div className={styles.data}>
                            <div style={{ width: '45px' }}>{i.envase_codigo}</div>
                            <div style={{ width: '150px' }}>{i.envase_nombre}</div>
                            <div style={{ width: '45px', textAlign: 'center' }}>{i.cantidad}</div>
                            <div
                              style={{ width: '60px', textAlign: 'right' }}>{numeral(i.precio).format('$0,0.00')}</div>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                  <div
                    className={styles.UltimoPedidoFecha}>{moment(this.getUpdatedCliente().fecha_ultima_compra).format('DD/MM/YYYY')}</div>
                </div>
              </div>
            )}
            <div
              className={classnames(styles.ClienteEstado, this.getUpdatedCliente().estado ? styles.activo : styles.inactivo)}>
              {this.getUpdatedCliente().estado ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          <div className={styles.ClienteInfo}>
            <div className={styles.ClienteInfoLeft}>
              <div className={styles.row}>
                <Input size='small' label='Razon Social' name='razon_social' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().razon_social}/>
                <Input size='small' label='Telefono' name='telefono' width={10} onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().telefono}/>
              </div>
              <div style={{ height: '250px', marginBottom: 8 }}>
                <ClienteMap onLocationChanged={this.onLocationChanged} onSetCoords={this.onSetCoords}
                            lat={this.getUpdatedCliente().latitud}
                            lng={this.getUpdatedCliente().longitud}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Altura' name='altura' onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().altura}/>
                <Input size='small' label='Calle' name='calle' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().calle}/>
                <Input size='small' label='Localidad' name='localidad' onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().localidad}/>
                <Input size='small' label='Codigo Postal' name='codigo_postal' onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().codigo_postal}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Entre' name='entre' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().entre}/>
                <Input size='small' label='Y' name='y' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().y}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Piso' name='piso' onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().piso}/>
                <Input size='small' label='Depto' name='depto' onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().depto}/>
                <Input size='small' fixedLabel label='Latitud' name='latitud' disabled onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().latitud}/>
                <Input size='small' fixedLabel label='Longitud' name='longitud' disabled onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().longitud}/>
              </div>
              <div className={styles.row}>
                <Select size='small' label='Zona' name='zona' placeholder='Seleccionar...'
                        value={selectedZonaId} options={zonasOptions}
                        onChange={this.onZonaChange}/>
                <Select size='small' label='Sub Zona' name='zona_sub_id' placeholder='Seleccionar...'
                        value={this.getUpdatedCliente().zona_sub_id} options={subzonasOptions}
                        onChange={this.onFieldChange}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Observaciones' name='observaciones' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedCliente().observaciones}/>
              </div>
            </div>
            <div className={styles.ClienteInfoRight}>
              <Input size='small' label='Cuit' name='cuit' onChange={this.onFieldChange}
                     value={this.getUpdatedCliente().cuit}/>
              <Select size='small' label='Condicion de IVA' name='condicion_iva_id' placeholder='Seleccionar...'
                      value={this.getUpdatedCliente().condicion_iva_id || 1} options={condicionesIvaOptions}
                      onChange={this.onFieldChange}/>
              <Select size='small' label='Condicion de Venta' name='condicion_venta_id' placeholder='Seleccionar...'
                      value={this.getUpdatedCliente().condicion_venta_id || 1} options={condicionesVentaOptions}
                      onChange={this.onFieldChange}/>
              <Select size='small' label='Canal' name='canal_id' placeholder='Seleccionar...'
                      value={this.getUpdatedCliente().canal_id || 1}
                      options={canalesOptions} onChange={this.onFieldChange}/>
              <Select size='small' label='Lista de Precio' name='lista_precio_id' placeholder='Seleccionar...'
                      value={this.getUpdatedCliente().lista_precio_id}
                      options={listasPrecioOptions} onChange={this.onFieldChange}/>

              <Button size='small' outline onClick={this.onSubmit}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
