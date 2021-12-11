import * as React from 'react';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as classnames from 'classnames';
import 'react-tabs/style/react-tabs.css';

import * as styles from './styles.css';

import { FormDetail } from './FormDetail';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import toastNotify from '../../../shared/components/ToastNotification';
import { DatePicker } from '../../../shared/components/DatePicker';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import {
  Envase as IEnvase,
  Chofer as IChofer,
  Cliente as ICliente,
  Comodato as IComodato,
  ComodatoItem as IItem, MovimientoStock, MovimientoStockItem
} from '../../../types';

import {
  TipoMovimiento
} from '../../../types/Stock';

import EnvasesService from '../../../services/envases';
import { Button } from '../../../shared/components/Button';
import ComodatosService from '../../../services/comodatos';
import { generarItems } from './utils';
import StockService from '../../../services/stock';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface StockFormProps {
  tipoMovimiento: TipoMovimiento
}

interface StockFormState {
  loading: boolean;
  showModal: boolean;
  controlError: string;
  isAddingItem: boolean;
  envases: Array<IEnvase>;
  comodatoCreated: boolean;
  editableItem: IEditable<MovimientoStockItem>;
  editableStock: IEditable<MovimientoStock>;
}

export class StockForm extends React.Component<StockFormProps, StockFormState> {
  formDetailRef;

  constructor(props) {
    super(props);

    this.formDetailRef = React.createRef();

    this.state = {
      envases: [],
      loading: true,
      showModal: false,
      editableItem: {},
      controlError: '',
      isAddingItem: false,
      editableStock: {
        modulo: 'Stock',
        tipo_movimiento: this.props.tipoMovimiento,
        fecha: moment().format('DD-MM-YYYY'),
      },
      comodatoCreated: false
    };
  }

  async componentDidMount() {
    const envases = await EnvasesService.getEnvases();

    this.setState({
      envases,
      loading: false,
    });
  }

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

  getUpdatedStock = () => {
    const { editableStock = {} } = this.state;

    return {
      ...editableStock
    };
  };

  onSubmit = async () => {
    try {
      const { editableStock } = this.state;
      let items = [];

      if (this.formDetailRef && this.formDetailRef.current) {
        items = this.formDetailRef.current.getItems().filter(i => i.envase_id !== '').map(i => ({
          envase_id: i.envase_id,
          cantidad: numeral(i.cantidad).value() || 0,
          costo: numeral(i.precio).value() || 0
        }))
      }

      const stockItems = generarItems(editableStock.tipo_movimiento, items);

      const newMovimiento = await StockService.createMovimiento({
        fecha: editableStock.fecha,
        tipo_movimiento: editableStock.tipo_movimiento,
        modulo: editableStock.modulo,
        nro_comprobante: editableStock.nro_comprobante
      });

      stockItems.forEach(item => {
        item.movimiento_stock_enc_id = newMovimiento.movimiento_stock_enc_id
      })

      await StockService.createMovimientoItems(newMovimiento.movimiento_stock_enc_id, stockItems);

      this.formDetailRef.current.clearItems();

      this.setState({
        editableStock: {
          modulo: 'Stock',
          nro_comprobante: '',
          tipo_movimiento: this.props.tipoMovimiento,
          fecha: moment().format('DD-MM-YYYY'),
        }
      })

      toastNotify.success({
        header: 'Movimiento generado correctamente.'
      })
    } catch (err) {
      console.log('err', err);
      toastNotify.error({
        header: 'Ha ocurrido un error.'
      })
    }
  };

  render() {
    const { envases, loading } = this.state;

    return (
      <OuterWrapper>
      <div className={styles.StockForm}>
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.StockInfo}>
            <div className={styles.StockInfoLeft}>
              <h3>{this.props.tipoMovimiento}</h3>
              <div className={styles.row}>
                <DatePicker
                  size='small'
                  value={this.getUpdatedStock().fecha || moment().format('DD-MM-YYYY')}
                  name='fecha'
                  label={'Fecha'}
                  onChange={this.onFieldChange}/>
                  <div style={{marginRight: 10}} />
                  <Input
                    size={'small'}
                    value={this.getUpdatedStock().nro_comprobante}
                    name={'nro_comprobante'}
                    label={'Nro de Comprobante'}
                    onChange={this.onFieldChange}
                  />
              </div>
              <div className={styles.row}>
                <FormDetail
                  ref={this.formDetailRef}
                  envases={envases.map(e => ({value: e.envase_id, label: e.envase_nombre}))}
                />
              </div>
            </div>
            <div className={styles.StockInfoRight}>
              <Button size='small' outline onClick={this.onSubmit}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
      </OuterWrapper>
    );
  }
}
