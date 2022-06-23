import * as React from 'react';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';

import * as styles from './styles.css';
import * as moment from 'moment';
import { DatePicker } from '../../../shared/components/DatePicker';
import { Canal, Zona } from '../../../types';
import ZonasService from '../../../services/zonas';
import { Select } from '../../../shared/components/Select';
import { Checkbox } from '../../../shared/components/Checkbox';
import { Button } from '../../../shared/components/Button';
import FeriadosService from '../../../services/feriados';
import { Input } from '../../../shared/components/Input';
import CanalesService from '../../../services/canales';
import ObjetivosService from '../../../services/objetivos';
import { LoadingIndicator } from '../../../shared/components/LoadingIndicator';

interface NewObjetivoState {
  loading: boolean;
  fecha: string;
  zonas: Zona[];
  canales: Canal[];
  diasHabiles: number;
  feriados: Array<any>;
  currentZonaId: number;
  trabajaSabado: boolean;
  trabajaSabadoMedio: boolean;
  butano: any;
  propano: any;
  precioButano: any;
  precioPropano: any;
}

export class NewObjetivo extends React.Component<any, NewObjetivoState> {
  constructor(props) {
    super(props);

    this.state = {
      zonas: [],
      butano: {},
      propano: {},
      canales: [],
      feriados: [],
      diasHabiles: 0,
      loading: false,
      precioButano: '',
      precioPropano: '',
      currentZonaId: null,
      trabajaSabado: false,
      trabajaSabadoMedio: false,
      fecha: moment().utc().format('DD-MM-YYYY')
    }
  }

  async componentDidMount() {
    const zonas = await ZonasService.getZonas();
    const canales = await CanalesService.getCanales();
    const feriados = await FeriadosService.getFeriados();

    this.setState({
      zonas,
      canales,
      feriados: feriados.map(feriado => ({
        medio: feriado.medio_dia,
        fecha: moment(feriado.fecha).utc().format('DD-MM-YYYY')
      }))
    })
  }

  verificarDias = () => {
    const diasHabiles = this.calcularDiasHabiles();
    this.setState({
      diasHabiles
    })
  }

  calcularDiasHabiles = () => {
    const { fecha, feriados, trabajaSabado, trabajaSabadoMedio } = this.state;

    let diasHabiles = 0;

    const startDate = moment(fecha, 'DD-MM-YYYY').startOf('month');
    const endDate = moment(fecha, 'DD-MM-YYYY').endOf('month');

    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      const currFecha = m.format('DD-MM-YYYY');
      const isSabado = m.isoWeekday() === 6;
      const isDomingo = m.isoWeekday() === 7;
      const feriado = feriados.find(feriado => feriado.fecha === currFecha);

      if (!isSabado && !isDomingo && !feriado) {
        diasHabiles++;
      }

      if (feriado && feriado.medio) {
        diasHabiles = diasHabiles + 0.5;
      }

      if (isSabado && trabajaSabado && !trabajaSabadoMedio && !feriado) {
        diasHabiles++;
      }

      if (isSabado && !trabajaSabado && trabajaSabadoMedio && !feriado) {
        diasHabiles = diasHabiles + 0.5;
      }
    }

    return diasHabiles;
  }

  getFechasHabiles = () => {
    const { fecha, feriados, trabajaSabado, trabajaSabadoMedio } = this.state;

    const fechasHabiles = [];

    const startDate = moment(fecha, 'DD-MM-YYYY').startOf('month');
    const endDate = moment(fecha, 'DD-MM-YYYY').endOf('month');

    for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      const currFecha = m.format('DD-MM-YYYY');
      const isSabado = m.isoWeekday() === 6;
      const isDomingo = m.isoWeekday() === 7;
      const feriado = feriados.find(feriado => feriado.fecha === currFecha);

      if (!isSabado && !isDomingo && !feriado) {
        fechasHabiles.push({
          fecha: currFecha,
          medio: false
        })
      }

      if (feriado && feriado.medio) {
        fechasHabiles.push({
          fecha: currFecha,
          medio: true
        })
      }

      if (isSabado && trabajaSabado && !trabajaSabadoMedio && !feriado) {
        fechasHabiles.push({
          fecha: currFecha,
          medio: false
        })
      }

      if (isSabado && !trabajaSabado && trabajaSabadoMedio && !feriado) {
        fechasHabiles.push({
          fecha: currFecha,
          medio: true
        })
      }
    }

    return fechasHabiles;
  }

  onFieldChange = (e) => {
    if (e.target.name.includes('butano')) {
      const canal_id = parseInt(e.target.name.split('_')[1]);
      this.setState({
        butano: {
          ...this.state.butano,
          [canal_id]: e.target.value
        }
      })
    }

    if (e.target.name.includes('propano')) {
      const canal_id = parseInt(e.target.name.split('_')[1]);
      this.setState({
        propano: {
          ...this.state.propano,
          [canal_id]: e.target.value
        }
      })
    }
  }

  calcularTotalButano = () => {
    const {butano} = this.state;

    return Object.keys(butano).reduce((acc, curr) => {
      return acc + parseFloat(butano[curr]);
    }, 0)
  }

  calcularTotalPropano = () => {
    const {propano} = this.state;

    return Object.keys(propano).reduce((acc, curr) => {
      return acc + parseFloat(propano[curr]);
    }, 0)
  }

  onSubmit = async () => {
    const {butano, propano, canales, currentZonaId, precioButano, precioPropano} = this.state;
    const diasHabiles = this.calcularDiasHabiles();
    const fechasHabiles = this.getFechasHabiles();
    const objetivoButano = [];
    const objetivoPropano = [];

    fechasHabiles.forEach(fechaHabil => {
      canales.forEach(canal => {
        const objButano = butano[canal.canal_id] || 0;
        let objDiarioButano = parseFloat(objButano) / diasHabiles;

        const objPropano = propano[canal.canal_id] || 0;
        let objDiarioPropano = parseFloat(objPropano) / diasHabiles;

        if (fechaHabil.medio) {
          objDiarioButano = objDiarioButano / 2;
          objDiarioPropano = objDiarioPropano / 2;
        }

        objetivoButano.push({
          zona_id: currentZonaId,
          canal_id: canal.canal_id,
          tipo_envase_id: 1,
          fecha: moment(fechaHabil.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          kilos_pto: objDiarioButano,
          pcio_me_pto: parseFloat(precioButano)
        })

        objetivoPropano.push({
          zona_id: currentZonaId,
          canal_id: canal.canal_id,
          tipo_envase_id: 2,
          fecha: moment(fechaHabil.fecha, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          kilos_pto: objDiarioPropano,
          pcio_me_pto: parseFloat(precioPropano)
        })
      })
    })

    const suma = objetivoButano.reduce((acc, curr) => {
      return acc + curr.kilos_pto
    }, 0);

    try {
      this.setState({
        loading: true
      });
      await ObjetivosService.createObjetivos([...objetivoButano, ...objetivoPropano]);
      window.location.reload();
    } catch (err) {
      console.log('err', err);
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const {fecha, zonas, canales, precioButano, precioPropano, diasHabiles, currentZonaId, trabajaSabado, trabajaSabadoMedio, butano, propano} = this.state;

    const zonasOptions = zonas.map(z => ({
      label: z.zona_nombre,
      value: z.zona_id
    }));

    return (
      <OuterWrapper>
        <div className={styles.NewObjetivo}>
          <div className={styles.NewObjetivoWrapper}>
            <div className={styles.row}>
              <DatePicker
                size='small'
                value={fecha || moment().format('DD-MM-YYYY')}
                name='fecha'
                label={'Fecha'}
                onChange={(e) => this.setState({fecha: e.target.value})}/>

              <div style={{width: 10}} />

              <Select size='small' label='Zona' name='zona_id' placeholder='Seleccionar...'
                      value={currentZonaId}
                      options={zonasOptions} onChange={(e) => this.setState({currentZonaId: e.target.value})}/>

              <div style={{width: 10}} />

              {this.state.loading && <LoadingIndicator size={'medium'} />}
            </div>
            <div className={styles.row}>
              <Checkbox checked={trabajaSabado} name={'presento_documento'} onChange={(e) => this.setState(({trabajaSabado: e.target.checked}))}>Trabaja Sabado?</Checkbox>
              <div style={{width: 10}} />
              <Checkbox checked={trabajaSabadoMedio} name={'presento_documento'} onChange={(e) => this.setState(({trabajaSabadoMedio: e.target.checked}))}>Trabaja Sabado Medio Dia?</Checkbox>
              <div style={{width: 10}} />
              <Button size={'tiny'} onClick={this.verificarDias}>Verificar Dias</Button>
              <div style={{width: 10}} />
              {diasHabiles > 0 && <span className={styles.DiasHabiles}>{diasHabiles} dias habiles</span>}
            </div>
            <div style={{height: 20}} />
            <div className={styles.row}>
              <h5>Butano</h5>
              {this.calcularTotalButano() > 0 && <h6>({this.calcularTotalButano()} kilos)</h6>}
            </div>
            <div className={styles.row}>
              <Input size='small' label='Precio Butano' name='precio_butano' onChange={(e) => this.setState({
                precioButano: e.target.value
              })}
                     value={precioButano}/>
            </div>
            <div className={styles.grid}>
              {canales.map(canal => (
                <Input size='small' label={canal.canal_nombre} name={`butano_${canal.canal_id}`} onChange={this.onFieldChange}
                       value={butano[canal.canal_id] || ''}/>
              ))}
            </div>
            <div style={{height: 20}} />
            <div className={styles.row}>
              <h5>Propano</h5>
              {this.calcularTotalPropano() > 0 && <h6>({this.calcularTotalPropano()} kilos)</h6>}
            </div>
            <div className={styles.row}>
              <Input size='small' label='Precio Propano' name='precio_propano' onChange={(e) => this.setState({
                precioPropano: e.target.value
              })}
                     value={precioPropano}/>
            </div>
            <div className={styles.grid}>
              {canales.map(canal => (
                <Input size='small' label={canal.canal_nombre} name={`propano_${canal.canal_id}`} onChange={this.onFieldChange}
                       value={propano[canal.canal_id] || ''}/>
              ))}
            </div>

            <div className={styles.row} style={{justifyContent: 'end'}}>
             <Button size={'small'} onClick={this.onSubmit}>Grabar</Button>
           </div>
          </div>
        </div>
      </OuterWrapper>
    )
  }
}
