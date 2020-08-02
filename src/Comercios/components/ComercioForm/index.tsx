import * as React from 'react';
import * as moment from 'moment';
import * as numeral from 'numeral';
import * as classnames from 'classnames';
import { Link, Redirect } from 'react-router-dom';

import * as styles from './styles.css';

import ComercioMap from './ComercioMap';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/Select';
import { LoadingContainer } from '../../../shared/components/LoadingContainer';

import {
  Zona as IZona,
  Subzona as ISubzona,
  Comercio as IComercio,
  CondicionIva as ICondicionIva,
  UltimoPedidoView as IUltimoPedidoView
} from '../../../types';

import ZonasService from '../../../services/zonas';
import SubzonasService from '../../../services/subzonas';
import ComerciosService from '../../../services/comercios';
import CondicionesIvaService from '../../../services/condicionesIva';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface ComercioFormProps {
  nuevo?: boolean;
  comercio?: IComercio;
  ultimoPedido?: IUltimoPedidoView
}

interface ComercioFormState {
  zonas: Array<IZona>;
  selectedZonaId: number;
  subzonas: Array<ISubzona>;
  condicionesIva: Array<ICondicionIva>;
  editableComercio: IEditable<IComercio>;
  loading: boolean;
}

export class ComercioForm extends React.Component<ComercioFormProps, ComercioFormState> {
  constructor(props) {
    super(props);

    this.state = {
      editableComercio: {},
      zonas: [],
      subzonas: [],
      condicionesIva: [],
      selectedZonaId: null,
      loading: true
    };
  }

  async componentDidMount() {
    const zonas = await ZonasService.getZonas();
    const subzonas = await SubzonasService.getSubzonas();
    const condicionesIva = await CondicionesIvaService.getCondicionesIva();

    if (this.props.nuevo) {
      await this.createNewCliente();
    }

    this.setState({ zonas, subzonas, condicionesIva, loading: false });
  }

  createNewCliente = () => {
    const { editableComercio } = this.state;
    this.setState({
      editableComercio: {
        ...editableComercio,
        condicion_iva_id: 1
      }
    });
  };

  onSetCoords = (lat, lng) => {
    const { editableComercio = {} } = this.state;

    editableComercio.latitud = lat;
    editableComercio.longitud = lng;

    this.setState({ editableComercio: { ...editableComercio } });
  };

  onLocationChanged = (lat, lng, calle, altura, localidad, codigoPostal, provincia) => {
    const { editableComercio = {} } = this.state;

    if (calle) {
      editableComercio.calle = calle;
    }

    if (altura) {
      editableComercio.altura = altura;
    }

    if (localidad) {
      editableComercio.localidad = localidad;
    }

    if (codigoPostal) {
      editableComercio.codigo_postal = codigoPostal;
    }

    editableComercio.latitud = lat;
    editableComercio.longitud = lng;

    this.setState({ editableComercio: { ...editableComercio } });
  };

  onFieldChange = (e) => {
    const { editableComercio = {} } = this.state;
    this.setState({
      editableComercio: {
        ...editableComercio,
        [e.target.name]: e.target.value
      }
    });
  };

  onZonaChange = (e) => {
    const selectedZonaId = e.target.value;
    const subzonas = this.state.subzonas.filter(s => s.zona_id === selectedZonaId);
    this.setState({ subzonas, selectedZonaId });
  };

  getUpdatedComercio = () => {
    const { comercio } = this.props;
    const { editableComercio = {} } = this.state;

    return {
      ...comercio,
      ...editableComercio
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
    const comercio = this.getUpdatedComercio();

    if (this.props.comercio) {
      const updatedComercio = await ComerciosService.updateComercio(comercio, comercio.id);
      this.setState({ loading: false, editableComercio: { ...updatedComercio } });
    } else {
      const newComercio = await ComerciosService.createComercio(comercio);
      this.setState({ loading: false, editableComercio: { ...newComercio } });
    }
  };

  render() {
    const { nuevo, ultimoPedido } = this.props;
    const { zonas, subzonas, selectedZonaId, condicionesIva, loading } = this.state;

    const zonasOptions = zonas.map(z => ({
      label: z.zona_nombre,
      value: z.zona_id
    }));

    const subzonasOptions = subzonas.map(s => ({
      label: s.sub_zona_nombre,
      value: s.sub_zona_id
    }));

    const condicionesIvaOptions = condicionesIva.map(c => ({
      label: c.condicion_iva_nombre,
      value: c.condicion_iva_id
    }));

    return (
      <div className={styles.ComercioForm}>
        {nuevo && this.getUpdatedComercio().id &&
        <Redirect to={`/comercios/${this.getUpdatedComercio().id}`}/>}
        <div className={styles.FormWrapper}>
          {loading && (
            <LoadingContainer size={'medium'}/>
          )}
          <div className={styles.ComercioSummary}>
            <div className={styles.ComercioCodigo}>
              <span>#</span> {this.getUpdatedComercio().id}
            </div>
            <div
              className={classnames(styles.ComercioEstado, this.getUpdatedComercio().estado ? styles.activo : styles.inactivo)}>
              {this.getUpdatedComercio().estado ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          <div className={styles.ComercioInfo}>
            <div className={styles.ComercioInfoLeft}>
              <div className={styles.row}>
                <Input size='small' label='Razon Social' name='razon_social' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().razon_social}/>
              </div>
              <div style={{ height: '250px', marginBottom: 8 }}>
                <ComercioMap onLocationChanged={this.onLocationChanged} onSetCoords={this.onSetCoords}
                            lat={this.getUpdatedComercio().latitud}
                            lng={this.getUpdatedComercio().longitud}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Altura' name='altura' onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().altura}/>
                <Input size='small' label='Calle' name='calle' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().calle}/>
                <Input size='small' label='Localidad' name='localidad' onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().localidad}/>
                <Input size='small' label='Codigo Postal' name='codigo_postal' onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().codigo_postal}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Entre' name='entre' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().entre}/>
                <Input size='small' label='Y' name='y' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().y}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Piso' name='piso' onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().piso}/>
                <Input size='small' label='Depto' name='depto' onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().depto}/>
                <Input size='small' fixedLabel label='Latitud' name='latitud' disabled onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().latitud}/>
                <Input size='small' fixedLabel label='Longitud' name='longitud' disabled onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().longitud}/>
              </div>
              <div className={styles.row}>
                <Select size='small' label='Zona' name='zona' placeholder='Seleccionar...'
                        value={selectedZonaId} options={zonasOptions}
                        onChange={this.onZonaChange}/>
                <Select size='small' label='Sub Zona' name='zona_sub_id' placeholder='Seleccionar...'
                        value={this.getUpdatedComercio().zona_sub_id} options={subzonasOptions}
                        onChange={this.onFieldChange}/>
              </div>
              <div className={styles.row}>
                <Input size='small' label='Observaciones' name='observaciones' fluid onChange={this.onFieldChange}
                       value={this.getUpdatedComercio().observaciones}/>
              </div>
            </div>
            <div className={styles.ComercioInfoRight}>
              <Input size='small' label='Email' name='email' onChange={this.onFieldChange}
                     value={this.getUpdatedComercio().email}/>
              <Input size='small' label='Telefono' name='telefono' onChange={this.onFieldChange}
                     value={this.getUpdatedComercio().telefono}/>
              <Input size='small' label='Cuit' name='cuit' onChange={this.onFieldChange}
                     value={this.getUpdatedComercio().cuit}/>
              <Select size='small' label='Condicion de IVA' name='condicion_iva_id' placeholder='Seleccionar...'
                      value={this.getUpdatedComercio().condicion_iva_id || 1} options={condicionesIvaOptions}
                      onChange={this.onFieldChange}/>

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
