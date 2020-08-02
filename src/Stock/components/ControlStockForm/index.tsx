import * as React from 'react';
import * as moment from 'moment';
import { startCase } from 'lodash';
import * as styles from './styles.css';

import HojasService from '../../../services/hojas';
import StockService from '../../../services/stock';
import CargasService from '../../../services/cargas';
import EnvasesService from '../../../services/envases';
import ChoferesService from '../../../services/choferes';
import MovimientosService from '../../../services/movimientos';
import { ColumnaStock } from './ColumnaStock';
import {
  Hoja as IHoja,
  Carga as ICarga,
  Chofer as IChofer,
  Envase as IEnvase,
  ColumnaStock as IColumnaStock,
  Movimiento as IMovimiento, MovimientoStock, MovimientoStockItem
} from '../../../types';
import { DatePicker } from '../../../shared/components/DatePicker';
import { Select } from '../../../shared/components/Select';
import { checkStock, generarStockEnc, generarStockDet } from './utils';
import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';
import { Modal } from '../../../shared/components/Modal';
import { DetalleStock } from './DetalleStock';
import choferes from '../../../services/choferes';

interface ControlStockFormProps {
  cierre: boolean;
}

interface ControlStockFormState {
  fecha: string;
  hojas: Array<IHoja>;
  cargas: Array<ICarga>;
  envases: Array<IEnvase>;
  choferes: Array<IChofer>;
  columnas: Array<IColumnaStock>;
  movimientos: Array<IMovimiento>;
  selectedHoja: number;
  selectedColumna: IColumnaStock;
  showDetalle: boolean;
  loading: boolean;
}

export class ControlStockForm extends React.Component<ControlStockFormProps, ControlStockFormState> {
  checkOk: boolean = true;

  constructor(props: ControlStockFormProps) {
    super(props);

    this.state = {
      fecha: moment().format('DD/MM/YYYY'),
      hojas: [],
      cargas: [],
      envases: [],
      choferes: [],
      columnas: [],
      movimientos: [],
      selectedHoja: null,
      selectedColumna: null,
      showDetalle: false,
      loading: false
    };
  };

  async componentDidMount() {
    const { fecha } = this.state;
    //const hojas = await HojasService.getHojasByFecha(moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    const hojas = await this.fetchHojas(fecha);
    const envases = await EnvasesService.getEnvases();
    const choferes = await ChoferesService.getChoferes();
    const columnas = await StockService.getColumnasStock();

    this.setState({
      hojas,
      envases,
      choferes,
      columnas
    });
  };

  fetchHojas = async (fecha) => {
    const { cierre } = this.props;

    let hojas = await HojasService.getHojasByFecha(moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'));

    if (cierre) {
      hojas = hojas.filter(h => !h.estado && !h.cierre_stock);
    } else {
      hojas = hojas.filter(h => h.estado && !h.control_stock);
    }

    return hojas;
  };

  onFechaChange = async (e) => {
    const fecha = e.target.value;
    //const hojas = await HojasService.getHojasByFecha(moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    const hojas = await this.fetchHojas(fecha);

    this.setState({
      fecha,
      hojas,
      selectedHoja: null
    });
  };

  onSelectHoja = async (e) => {
    this.checkOk = true;

    this.setState({
      loading: true
    });

    const cargas = await CargasService.getCargasByHoja(e.target.value);
    const movimientos = await MovimientosService.getMovimientosByHoja(e.target.value);

    this.setState({
      cargas,
      movimientos,
      selectedHoja: e.target.value,
      loading: false
    });
  };

  checkStock = (c): boolean => {
    const { cargas, envases, movimientos } = this.state;
    const checkOk = checkStock(c.articulos.split(','), envases, cargas, movimientos.filter(m => m.estado_movimiento_id === 3));
    if (!checkOk) this.checkOk = false;
    return checkOk;
  };

  lockStock = async () => {
    const { cierre } = this.props;
    const { hojas, selectedHoja, columnas, cargas, envases, movimientos } = this.state;

    const hoja = hojas.find(h => h.hoja_ruta_id === selectedHoja);
    const index = hojas.findIndex(h => h.hoja_ruta_id === hoja.hoja_ruta_id);

    if (cierre) {
      const enc: MovimientoStock = generarStockEnc(hoja);
      const newMovimiento = await StockService.createMovimiento(enc);

      const det: Array<MovimientoStockItem> = [];

      columnas.forEach(c => {
        det.push(...generarStockDet(c.articulos.split(','), envases, cargas, movimientos, c.stock, newMovimiento.movimiento_stock_enc_id))
      });

      await StockService.createMovimientoItems(newMovimiento.movimiento_stock_enc_id, det);

      hoja.cierre_stock = true;
    } else {
      hoja.control_stock = true;
    }

    await HojasService.updateHoja(hoja.hoja_ruta_id, hoja);

    hojas.splice(index, 1);

    this.setState({
      hojas,
      selectedHoja: null
    });
  };

  showDetalle = (columna: IColumnaStock) => {
    this.setState({
      selectedColumna: columna,
      showDetalle: true
    });
  };

  render() {
    const { cierre } = this.props;
    const { fecha, hojas, cargas, envases, choferes, columnas, movimientos, selectedHoja, selectedColumna, showDetalle, loading } = this.state;
    const hojasOptions = hojas.map(h => {
      const chofer = choferes.find(c => c.chofer_id === h.chofer_id);
      return {
        label: `${startCase(chofer.apellido.toLowerCase())}, ${startCase(chofer.nombre.toLowerCase())}`,
        value: h.hoja_ruta_id
      }
    });

    const columns = selectedHoja && columnas.map(c => {
      return (
        <ColumnaStock
          control={this.checkStock(c)}
          column={c}
          key={c.id}
          showDetalle={() => this.showDetalle(c)}
        />
      );
    });

    return (
      <div className={styles.FormWrapper}>
        <div className={styles.FormTitle}>{`${cierre ? 'Cierre' : 'Control'} Stock`}</div>
        <div className={styles.ColumnaStockWrapperHeader}>
          <DatePicker
            name={'fecha'}
            value={fecha}
            size={'small'}
            className={styles.DateInput}
            onChange={this.onFechaChange}/>
          <div style={{ marginRight: 10 }}/>
          <div style={{ position: 'relative' }}>
            <Select
              size='small'
              label='Hojas de Ruta'
              name='hojas'
              placeholder='Seleccionar...'
              value={selectedHoja || ''}
              options={hojasOptions}
              onChange={this.onSelectHoja}
            />
            <div style={{ position: 'absolute', left: '90px', top: '5px' }}>
              {loading && <LoadingIndicator size='small'/>}
            </div>
            <div className={styles.lock}>
              {selectedHoja && this.checkOk && <i className="fas fa-lock" onClick={this.lockStock}/>}
            </div>
          </div>
        </div>
        <div className={styles.ColumnaStockWrapper}>
          {columns}
        </div>
        <Modal
          show={showDetalle}
          onOk={() => this.setState({ showDetalle: false, selectedColumna: null })}
          size='fit'
        >
          <DetalleStock
            cargas={cargas}
            envases={envases}
            columna={selectedColumna}
            movimientos={movimientos.filter(m => m.estado_movimiento_id === 3)}
          />
        </Modal>
      </div>
    );
  }
}
