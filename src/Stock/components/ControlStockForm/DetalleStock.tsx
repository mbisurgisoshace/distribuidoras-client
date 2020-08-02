import * as React from 'react';
import { pick, map } from 'lodash';
import * as uuidv4 from 'uuid/v4';

import * as styles from './styles.css';

import {
  Carga as ICarga,
  Envase as IEnvase,
  ColumnaStock as IColumnaStock,
  Movimiento as IMovimiento
} from '../../../types';

interface DetalleStockProps {
  cargas: Array<ICarga>;
  columna: IColumnaStock;
  envases: Array<IEnvase>;
  movimientos: Array<IMovimiento>;
}

export class DetalleStock extends React.Component<DetalleStockProps, any> {
  constructor(props) {
    super(props);
  }

  getCarga = (cargaId: number) => {
    const { cargas } = this.props;
    const { articulos } = this.props.columna;
    const filterCargas: Array<ICarga> = [];
    cargas.forEach(c => {
      filterCargas.push({
        ...c,
        items: c.items.filter(i => articulos.split(',').includes(i.envase_id.toString()))
      });
    });

    const carga = filterCargas.find(c => c.carga_tipo_id === cargaId);

    if (carga && carga.items.length > 0) {
      return pick(carga.items[0], ['lleno', 'vacio', 'averiado', 'retiro', 'entrega', 'cambio']);
    } else {
      return { lleno: 0, vacio: 0, averiado: 0, retiro: 0, entrega: 0, cambio: 0 };
    }
  };

  getVentas = () => {
    const { envases, movimientos } = this.props;
    const { articulos } = this.props.columna;

    const filterMovimientos = [];
    movimientos.forEach(m => {
      filterMovimientos.push({
        ...m,
        items: m.items.filter(i => articulos.split(',').includes(i.envase_id.toString()))
      });
    });

    return filterMovimientos.map(m => m.items.reduce((acc, curr) => {
      let cantidad = 0;
      const envase = envases.find(e => e.envase_id === curr.envase_id);

      if (envase && (envase.tipo_envase_id === 1 || envase.tipo_envase_id === 2)) {
        cantidad = curr.cantidad;
      }

      return acc + cantidad;
    }, 0)).reduce((acc, curr) => acc + curr, 0);
  };

  getVtaEnvases = () => {
    const { envases, movimientos } = this.props;
    const { articulos } = this.props.columna;

    const filterMovimientos = [];
    movimientos.forEach(m => {
      filterMovimientos.push({
        ...m,
        items: m.items.filter(i => articulos.split(',').includes(i.envase_id.toString()))
      });
    });

    return filterMovimientos.map(m => m.items.reduce((acc, curr) => {
      let cantidad = 0;
      const envase = envases.find(e => e.envase_id === curr.envase_id);

      if (envase && envase.tipo_envase_id === 4) {
        cantidad = curr.cantidad;
      }

      return acc + cantidad;
    }, 0)).reduce((acc, curr) => acc + curr, 0);
  };

  render() {
    const { columna } = this.props;

    const estadosLabels = [
      'Lleno',
      'Vacio',
      'Averiado',
      'Retiro',
      'Entrega',
      'Cambio'
    ];

    return (
      <div className={styles.DetalleStock}>
        <div className={styles.Header}>
          <div>Detalle <span className={styles.Articulo}>{columna.label}</span></div>
        </div>
        <div className={styles.Group}>
          <div className={styles.Title}>Movimientos Stock</div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}/>
            {estadosLabels.map(e => (
              <div key={e} className={styles.Value} style={{ textAlign: 'center', color: '#9fa1ab' }}>{e}</div>
            ))}
          </div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>CI</div>
            {map(this.getCarga(1), v => (<div key={uuidv4()} className={styles.Value}>{v}</div>))}
          </div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>RP</div>
            {map(this.getCarga(2), v => (<div key={uuidv4()} className={styles.Value}>{v}</div>))}
          </div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>RE1</div>
            {map(this.getCarga(3), v => (<div key={uuidv4()} className={styles.Value}>{v}</div>))}
          </div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>RE2</div>
            {map(this.getCarga(4), v => (<div key={uuidv4()} className={styles.Value}>{v}</div>))}
          </div>
        </div>
        <div className={styles.Group}>
          <div className={styles.Title}>Movimientos Venta</div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>Cargas</div>
            <div className={styles.Value}>{this.getVentas()}</div>
          </div>
        </div>
        <div className={styles.Group}>
          <div className={styles.Title}>Movimientos Envases</div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>Ventas</div>
            <div className={styles.Value}>{this.getVtaEnvases()}</div>
          </div>
          <div className={styles.Envases}>
            <div className={styles.Subtitle}>Compras</div>
            <div className={styles.Value}>0</div>
          </div>
        </div>
      </div>
    );
  }
}
