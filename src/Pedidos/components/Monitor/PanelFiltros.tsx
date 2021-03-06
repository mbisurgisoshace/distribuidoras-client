import * as React from 'react';
import * as moment from 'moment';

import * as styles from './styles.css';
import { DatePicker } from '../../../shared/components/DatePicker';
import { Select } from '../../../shared/components/Select';
import { Canal, Chofer, CondicionVenta } from '../../../types';
import ChoferesService from '../../../services/choferes';
import CanalesService from '../../../services/canales';
import { Button } from '../../../shared/components/Button';
import EstadosMovimientoService from '../../../services/estadosMovimiento';
import CondicionesVentaService from '../../../services/condicionesVenta';
import TiposMovimientoService from '../../../services/tiposMovimiento';

interface FiltrosProps {
  onSearch: (currFilter) => void;
  onGeneracionRemitos: () => void;
  onActualizacionMasiva: () => void;
  onSincronizacionRemitos: () => void;
}

interface FiltrosState {
  currFilter: any;
  tipos: Array<any>;
  estados: Array<any>;
  canales: Array<Canal>;
  choferes: Array<Chofer>;
  condiciones: Array<CondicionVenta>;
}

export class PanelFiltros extends React.Component<FiltrosProps, FiltrosState> {
  constructor(props) {
    super(props);

    this.state = {
      tipos: [],
      canales: [],
      estados: [],
      choferes: [],
      condiciones: [],
      currFilter: {
        desde: moment().format('DD-MM-YYYY'),
        hasta: moment().format('DD-MM-YYYY')
      }
    };
  }

  async componentDidMount() {
    const canales = await CanalesService.getCanales();
    const choferes = await ChoferesService.getChoferes();
    const tipos = await TiposMovimientoService.getTiposMovimiento();
    const estados = await EstadosMovimientoService.getEstadosMovimiento();
    const condiciones = await CondicionesVentaService.getCondicionesVenta();

    this.setState({
      tipos,
      canales,
      estados,
      choferes,
      condiciones
    });
  }

  onFechaChange = (e) => {
    this.setState({
      currFilter: {
        ...this.state.currFilter,
        [e.target.name]: e.target.value
      }
    });
  };

  onOptionChange = (e) => {
    this.setState({
      currFilter: {
        ...this.state.currFilter,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    const { tipos, canales, estados, choferes, condiciones, currFilter } = this.state;

    const tiposOptions = tipos.map(tip => ({
      label: tip.tipo_movimiento_nombre,
      value: tip.tipo_movimiento_id
    }));

    const canalesOptions = canales.map(c => ({
      label: c.canal_nombre,
      value: c.canal_id
    }));

    const estadosOptions = estados.map(e => ({
      label: e.estado_movimiento_nombre,
      value: e.estado_movimiento_id
    }));

    const choferesptions = choferes.map(c => ({
      label: `${c.nombre}, ${c.apellido}`,
      value: c.chofer_id
    }));

    const condicionesOptions = condiciones.map(c => ({
      label: c.condicion_venta_nombre,
      value: c.condicion_venta_id
    }));

    return (
      <div className={styles.PanelFiltros}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className={styles.FiltrosItem}>
            <DatePicker
              fluid
              fixedLabel
              name={'desde'}
              size={'small'}
              label={'Desde'}
              value={currFilter.desde}
              onChange={this.onFechaChange}
            />
            <DatePicker
              fluid
              fixedLabel
              name={'hasta'}
              size={'small'}
              label={'Hasta'}
              value={currFilter.hasta}
              onChange={this.onFechaChange}
            />
            <Select
              multiple
              size={'small'}
              name={'tipos'}
              label={'Tipo Movimiento'}
              options={tiposOptions}
              onChange={this.onOptionChange}
              value={currFilter.tipos || []}
            />
            <Select
              multiple
              size={'small'}
              name={'chofer'}
              label={'Chofer'}
              options={choferesptions}
              onChange={this.onOptionChange}
              value={currFilter.chofer || []}
            />
            <Select
              multiple
              size={'small'}
              name={'estado'}
              label={'Estado'}
              options={estadosOptions}
              onChange={this.onOptionChange}
              value={currFilter.estado || []}
            />
            <Select
              multiple
              size={'small'}
              name={'canal'}
              label={'Canal'}
              options={canalesOptions}
              onChange={this.onOptionChange}
              value={currFilter.canal || []}
            />
            <Select
              multiple
              size={'small'}
              name={'condicion'}
              label={'Condicion Venta'}
              options={condicionesOptions}
              onChange={this.onOptionChange}
              value={currFilter.condicion || []}
            />
          </div>
          <Button
            size={'small'}
            onClick={() => this.props.onSearch(currFilter)}
          >
            Filtrar
          </Button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem'}}>
          <Button
            size={'small'}
            onClick={() => this.props.onGeneracionRemitos()}
          >
            Generar Remitos
          </Button>
          <div style={{height: 10}} />
          <Button
            size={'small'}
            onClick={() => this.props.onSincronizacionRemitos()}
          >
            Sincronizar Remitos
          </Button>
          <div style={{height: 10}} />
          <Button
            size={'small'}
            onClick={() => this.props.onActualizacionMasiva()}
          >
            Actualizacion Masiva
          </Button>
        </div>
      </div>
    );
  }
}
