import * as React from 'react';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as classnames from 'classnames';
import 'react-tabs/style/react-tabs.css';

import * as styles from './styles.css';

import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { DatePicker } from '../../../shared/components/DatePicker';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';

import {
  Envase as IEnvase,
  Chofer as IChofer,
  Cliente as ICliente,
  Comodato as IComodato,
  ComodatoItem as IItem,
} from '../../../types';

import EnvasesService from '../../../services/envases';
import ChoferesService from '../../../services/choferes';
import { Button } from '../../../shared/components/Button';
import MovimientosService from '../../../services/movimientos';
import { Modal } from '../../../shared/components/Modal';
import { ClientsInputSearch } from '../../../shared/components/ClientsInputSearch/ClientsInputSearch';
import ClientesService from '../../../services/clientes';
import ComodatosService from '../../../services/comodatos';
import { Redirect } from 'react-router-dom';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface PedidoFormState {
  loading: boolean;
  controlError: string;
  isAddingItem: boolean;
  editarCliente: boolean;
  envases: Array<IEnvase>;
  choferes: Array<IChofer>;
  comodatoCreated: boolean;
  clientes: Array<ICliente>;
  pedidoConfirmado: boolean;
  comodatoVigente: IComodato;
  cliente: IEditable<ICliente>;
  editableItem: IEditable<IItem>;
  editableComodato: IEditable<IComodato>;
}

export class ComodatoForm extends React.Component<any, PedidoFormState> {
  constructor(props) {
    super(props);

    this.state = {
      envases: [],
      choferes: [],
      clientes: [],
      cliente: null,
      loading: true,
      editableItem: {},
      controlError: '',
      isAddingItem: false,
      editableComodato: {},
      editarCliente: false,
      comodatoVigente: null,
      comodatoCreated: false,
      pedidoConfirmado: false
    };
  }

  async componentDidMount() {
    const envases = await EnvasesService.getEnvases();
    const clientes = await ClientesService.getClientes();
    const choferes = await ChoferesService.getChoferes();

    document.addEventListener('keypress', this.handleKeyPress);

    this.setState({
      clientes,
      envases,
      choferes,
      loading: false,
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

  createNewComodato = (cliente_id): IComodato => {
    return {
      items: [],
      cliente_id,
      fecha: moment().format('DD-MM-YYYY'),
      fecha_vencimiento: moment().add(1, 'year').format('DD-MM-YYYY'),
      fecha_renovacion: moment().add(1, 'year').subtract(1, 'month').format('DD-MM-YYYY'),
      vigente: true,
      renovado: false,
      nro_comprobante: '',
      monto: 0
    }
  };

  onClientSelected = async (cliente) => {
    let comodato: IComodato;
    const comodatoVigente = await ComodatosService.getComodatoVigenteByCliente(cliente.cliente_id);

    if (comodatoVigente) {
      comodato = {
        cliente_id: comodatoVigente.cliente_id,
        items: comodatoVigente.items.map(i => ({
          cantidad: i.cantidad,
          monto: i.monto,
          envase_id: i.envase_id
        })),
        fecha: moment().format('DD-MM-YYYY'),
        fecha_vencimiento: moment().add(1, 'year').format('DD-MM-YYYY'),
        fecha_renovacion: moment().add(1, 'year').subtract(1, 'month').format('DD-MM-YYYY'),
        vigente: true,
        renovado: false,
        nro_comprobante: '',
        monto: comodatoVigente.monto
      };
    } else {
      comodato = this.createNewComodato(cliente.cliente_id);
    }

    this.setState({
      cliente,
      comodatoVigente,
      editableComodato: {
        ...comodato
      }
    });
  };

  onFieldChange = (e) => {
    const { editableComodato = {} } = this.state;
    this.setState({
      editableComodato: {
        ...editableComodato,
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

  getUpdatedComodato = () => {
    const { editableComodato = {} } = this.state;

    return {
      ...editableComodato
    };
  };

  addItem = (isDone: boolean) => {
    const { editableItem, editableComodato } = this.state;

    if (isDone) {
      editableComodato.items.push(editableItem);

      this.setState({
        editableItem: {},
        isAddingItem: false,
        editableComodato: {
          ...editableComodato
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
    let { editableItem = {}, editableComodato } = this.state;

    if (e.target.name === 'envase_id') {
      if (index !== null) {
        editableComodato.items[index] = {
          ...editableComodato.items[index]
        };
      } else {
        editableItem = {
          ...editableItem
        };
      }
    }

    if (index !== null) {
      editableComodato.items[index] = {
        ...editableComodato.items[index],
        [e.target.name]: e.target.value
      };

      this.setState({
        editableComodato: {
          ...editableComodato
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
    const { editableComodato } = this.state;
    editableComodato.items.splice(itemIndex, 1);

    this.setState({
      editableComodato: {
        ...editableComodato
      }
    });
  };

  getTotal = (cantidad, precio) => {
    return isNaN(cantidad * precio) ? 0 : cantidad * precio;
  };

  onSubmit = async () => {
    const { editableComodato, comodatoVigente } = this.state;

    const enc: IComodato = {
      cliente_id: editableComodato.cliente_id,
      observaciones: editableComodato.observaciones,
      fecha: moment(editableComodato.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      fecha_vencimiento: moment(editableComodato.fecha_vencimiento, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      fecha_renovacion: moment(editableComodato.fecha_vencimiento, 'DD/MM/YYYY').subtract(1, 'month').format('YYYY-MM-DD'),
      nro_comprobante: editableComodato.nro_comprobante,
      vigente: true,
      renovado: false,
      chofer_id: editableComodato.chofer_id,
      monto: editableComodato.items.reduce((pre, curr) => {
        return pre + parseInt(curr.monto as any);
      }, 0)
    };

    if (comodatoVigente) {
      enc.items = editableComodato.items;
      await ComodatosService.renovarComodato(comodatoVigente.comodato_enc_id, enc);
    } else {
      const newComodato = await ComodatosService.createComodato(enc);

      const det: Array<IItem> = editableComodato.items.map(i => ({
        comodato_enc_id: newComodato.comodato_enc_id,
        envase_id: i.envase_id,
        cantidad: i.cantidad,
        monto: i.cantidad * i.monto
      }));

      await ComodatosService.createComodatoItems(newComodato.comodato_enc_id, det);
    }

    this.setState({
      comodatoCreated: true
    })
  };

  getUpdatedCliente = () => {
    const { cliente = {} } = this.state;

    return {
      ...cliente
    };
  };

  render() {
    const { nuevo } = this.props;
    const { cliente, envases, clientes, choferes, loading, isAddingItem, pedidoConfirmado, comodatoCreated } = this.state;

    const envasesOptions = envases.map(e => ({
      value: e.envase_id,
      label: e.envase_nombre
    }));

    const choferesOptions = choferes.map(c => ({
      value: c.chofer_id,
      label: `${c.apellido}, ${c.nombre}`
    }));

    if (comodatoCreated) {
      return <Redirect to={`/clientes/${cliente.cliente_id}`} />
    }

    return (
      <div className={styles.ComodatoForm}>
        {nuevo && pedidoConfirmado && window.location.reload(false)}
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.ComodatoSummary}>
            <div className={styles.ComodatoId}>
              <span>#</span> {this.getUpdatedComodato().comodato_enc_id}
            </div>
          </div>
          <div className={styles.ComodatoInfo}>
            <div className={styles.ComodatoInfoLeft}>
              <div className={styles.row}>
                <div className={styles.ClienteWrapper}>
                  <div className={styles.ClienteWrapperHeader}>
                    <h3>Cliente</h3>
                    <ClientsInputSearch clientes={clientes}
                                        onSelectClient={(cliente) => this.onClientSelected(cliente)}/>
                  </div>
                  <div>
                    <div className={styles.ClienteDetailsFieldWrapper}>
                      <div className={styles.ClienteDetailsField}>
                        <>
                          <span>Razon Social:</span>
                          <p>{cliente && this.getUpdatedCliente().razon_social || ''}</p>
                        </>
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        <>
                          <span>Domicilio:</span>
                          <p>{`${cliente && this.getUpdatedCliente().calle || ''} ${cliente && this.getUpdatedCliente().altura || ''}`.trim()}</p>
                        </>
                      </div>
                      <div className={styles.ClienteDetailsField}>
                        <>
                          <span>Telefono:</span>
                          <p>{cliente && cliente.telefono || ''}</p>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.row} style={{justifyContent: 'space-between'}}>
                <DatePicker
                  size='small'
                  value={this.getUpdatedComodato().fecha || moment().format('DD-MM-YYYY')}
                  name='fecha'
                  label={'Fecha'}
                  onChange={this.onFieldChange}/>
                <DatePicker
                  size='small'
                  value={this.getUpdatedComodato().fecha_vencimiento || moment().format('DD-MM-YYYY')}
                  name='fecha_vencimiento'
                  label={'Fecha de Vencimiento'}
                  onChange={this.onFieldChange}/>
                  <Input
                    size={'small'}
                    value={this.getUpdatedComodato().nro_comprobante}
                    name={'nro_comprobante'}
                    label={'Nro de Comprobante'}
                    onChange={this.onFieldChange}
                  />
                <Select
                  size='small'
                  name='chofer_id'
                  label='Chofer'
                  value={this.getUpdatedComodato().chofer_id}
                  options={choferesOptions}
                  onChange={this.onFieldChange}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.DetalleWrapper}>
                  <div className={styles.DetalleWrapperHeader}>
                    <h3>Detalle Pedido</h3>
                    <svg className={styles.Icons} onClick={() => this.addItem(false)}>
                      <use xlinkHref={`/assets/images/sprite.svg#icon-plus-solid`}></use>
                    </svg>
                  </div>
                  {this.getUpdatedComodato().items && this.getUpdatedComodato().items.map((i, index) => (
                    <div className={classnames(styles.row, styles.ItemWrapper)} key={index}>
                      <Select size='small' name='envase_id' placeholder='Producto...'
                              value={this.getUpdatedComodato().items[index].envase_id} options={envasesOptions}
                              onChange={(e) => this.onItemFieldChange(e, index)}
                              className={styles.ItemSelectContainer}
                      />
                      <Input size='small' placeholder='Cantidad' name='cantidad'
                             onChange={(e) => this.onItemFieldChange(e, index)}
                             value={this.getUpdatedComodato().items[index].cantidad}
                             className={styles.ItemInputContainer}
                      />
                      <Input size='small' placeholder='Monto' name='monto'
                             onChange={(e) => this.onItemFieldChange(e, index)}
                             value={this.getUpdatedComodato().items[index].monto}
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
                      <Input size='small' placeholder='Monto' name='monto' onChange={this.onItemFieldChange}
                             value={this.getUpdatedItem().monto}
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
                <Input
                  size='small'
                  label={'Observaciones'}
                  name='observaciones'
                  fluid
                  onChange={this.onFieldChange}
                  value={this.getUpdatedComodato().observaciones}
                  className={classnames(styles.ItemInputContainer, styles.margin)}
                />
              </div>
            </div>
            <div className={styles.ComodatoInfoRight}>
              <Button disabled={!this.getUpdatedComodato().cliente_id} size='small' outline onClick={this.onSubmit}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
