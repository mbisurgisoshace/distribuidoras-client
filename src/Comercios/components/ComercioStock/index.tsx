import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';

import * as styles from './styles.css';

import { ComerciosSearch } from './ComerciosSearch';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/Select';
import { DatePicker } from '../../../shared/components/DatePicker';
import ClienteMap from '../../../Clientes/components/ClienteForm/ClienteMap';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import {
  Stock as IStock,
  Envase as IEnvase,
  Comercio as IComercio,
  StockItem as IStockItem
} from '../../../types';

import EnvasesService from '../../../services/envases';
import ComerciosService from '../../../services/comercios';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface ComercioStockState {
  loading: boolean;
  comercio: IComercio;
  isAddingItem: boolean;
  envases: Array<IEnvase>;
  stockConfirmado: boolean;
  editableStock: IEditable<IStock>;
  editableItem: IEditable<IStockItem>;
  toggleComerciosSearchModal: boolean;
}

export class ComercioStock extends React.Component<any, ComercioStockState> {
  constructor(props) {
    super(props);

    this.state = {
      envases: [],
      loading: true,
      comercio: null,
      editableItem: {},
      editableStock: {},
      isAddingItem: false,
      stockConfirmado: false,
      toggleComerciosSearchModal: false
    };
  }

  async componentDidMount() {
    const envases = await EnvasesService.getEnvases();

    document.addEventListener('keypress', this.handleKeyPress);

    await this.createNewStock();

    this.setState({ envases, loading: false });
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

  createNewStock = () => {
    const { editableStock } = this.state;
    this.setState({
      editableStock: {
        ...editableStock,
        items: [],
        tipo: 'compra',
        fecha: moment().format('DD-MM-YYYY')
      }
    });
  };

  onComercioSelected = (comercio) => {
    const { editableStock } = this.state;

    this.setState({
      comercio,
      editableStock: {
        ...editableStock,
        comercio_id: comercio.id
      }
    });
  };

  onFieldChange = (e) => {
    const { editableStock = {} } = this.state;
    this.setState({
      editableStock: {
        ...editableStock,
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

  getUpdatedStock = (): any => {
    const { editableStock = {} } = this.state;

    return {
      ...editableStock
    };
  };

  addItem = (isDone: boolean) => {
    const { editableItem, editableStock } = this.state;

    if (isDone) {
      editableStock.items.push(editableItem);

      this.setState({
        editableItem: {},
        isAddingItem: false,
        editableStock: {
          ...editableStock
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
    let { editableItem = {}, editableStock } = this.state;

    if (index !== null) {
      editableStock.items[index] = {
        ...editableStock.items[index],
        [e.target.name]: e.target.value
      };

      this.setState({
        editableStock: {
          ...editableStock
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
    const { editableStock } = this.state;
    editableStock.items.splice(itemIndex, 1);

    this.setState({
      editableStock: {
        ...editableStock
      }
    });
  };

  onSubmit = async () => {
    const { editableStock } = this.state;

    const stockItems: Array<IStockItem> = editableStock.items.map(i => ({
      cantidad: i.cantidad,
      envase_id: i.envase_id,
      tipo: editableStock.tipo,
      comercio_id: editableStock.comercio_id,
      comprobante: editableStock.comprobante,
      fecha: moment(editableStock.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }));

    const newStock = await ComerciosService.createStockComercio(stockItems);

    if (newStock) {
      this.setState({
        stockConfirmado: true
      })
    }
  };

  render() {
    const { loading, comercio, isAddingItem, envases, stockConfirmado, toggleComerciosSearchModal } = this.state;

    const envasesOptions = envases.map(e => ({
      value: e.envase_id,
      label: e.envase_nombre
    }));

    return (
      <OuterWrapper>
        <div className={styles.ComercioStockForm}>
          {stockConfirmado && window.location.reload(false)}
          <div className={styles.FormWrapper}>
            {loading && (
              <LoadingContainer size={'medium'}/>
            )}
            <div className={styles.ComercioStockSummary}>
              <div className={styles.StockId}>
                <span>#</span> {this.getUpdatedStock().movimiento_enc_id}
              </div>
            </div>
            <div className={styles.ComercioStockInfo}>
              <div className={styles.ComercioStockInfoLeft}>
                <div className={styles.row}>
                  <DatePicker
                    size='small'
                    value={this.getUpdatedStock().fecha || moment().format('DD-MM-YYYY')}
                    name='fecha'
                    label={'Fecha'}
                    onChange={this.onFieldChange}/>
                </div>
                <div className={styles.row} style={{marginTop: '1rem'}}>
                  <Input
                    size='small'
                    label='Numero de Comprobante'
                    name='comprobante'
                    onChange={this.onFieldChange}
                    value={this.getUpdatedStock().comprobante}
                    className={styles.ItemInputContainer}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.ComercioWrapper}>
                    <div className={styles.ComercioWrapperHeader}>
                      <h3>Comercio</h3>
                      <svg className={styles.Icons} onClick={() => this.setState({ toggleComerciosSearchModal: true })}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-users-solid`}></use>
                      </svg>
                      <svg className={styles.Icons} onClick={() => window.open('/comercios/new', '_blank')}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-user-plus-solid`}></use>
                      </svg>
                    </div>
                    <div>
                      <div className={styles.ComercioDetailsFieldWrapper}>
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
                      </div>
                      <div style={{ height: '250px', width: '100%' }}>
                        <ClienteMap
                          onlyView
                          lat={comercio && comercio.latitud}
                          lng={comercio && comercio.longitud}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.DetalleWrapper}>
                    <div className={styles.DetalleWrapperHeader}>
                      <h3>Detalle Envio Stock</h3>
                      <svg className={styles.Icons} onClick={() => this.addItem(false)}>
                        <use xlinkHref={`/assets/images/sprite.svg#icon-plus-solid`}></use>
                      </svg>
                    </div>
                    {this.getUpdatedStock().items && this.getUpdatedStock().items.map((i, index) => (
                      <div className={classnames(styles.row, styles.ItemWrapper)} key={index}>
                        <Select size='small' name='envase_id' placeholder='Producto...'
                                value={this.getUpdatedStock().items[index].envase_id} options={envasesOptions}
                                onChange={(e) => this.onItemFieldChange(e, index)}
                                className={styles.ItemSelectContainer}
                        />
                        <Input size='small' placeholder='Cantidad' name='cantidad'
                               onChange={(e) => this.onItemFieldChange(e, index)}
                               value={this.getUpdatedStock().items[index].cantidad}
                               className={styles.ItemInputContainer}
                        />

                        <svg style={{ marginLeft: 'auto' }} className={styles.Icons}
                             onClick={() => this.onDeleteItem(index)}>
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
                        <svg style={{ marginLeft: 'auto' }} className={styles.Icons} onClick={() => this.addItem(true)}>
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
              </div>
              <div className={styles.ComercioStockInfoRight}>
                <Button disabled={!this.getUpdatedStock().comercio_id} size='small' outline onClick={this.onSubmit}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
          {toggleComerciosSearchModal && (
            <ComerciosSearch
              onClose={() => this.setState({
                toggleComerciosSearchModal: false
              })}
              onSelectComercio={this.onComercioSelected}
            />
          )}
        </div>
      </OuterWrapper>
    );
  }
}
