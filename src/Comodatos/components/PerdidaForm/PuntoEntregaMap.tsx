import * as React from 'react';
import * as L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import {
  Comercio as IComercio
} from '../../../types';

const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

interface PuntoEntregaMapProps {
  lat: number;
  lng: number;
  comercios: Array<IComercio>
  onSelectComercio: (comercio: IComercio) => void;
}

export default class PuntoEntregaMap extends React.Component<PuntoEntregaMapProps> {
  map = null;
  marker = null;
  comercios = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { lat, lng, comercios } = this.props;

    this.map = L.map('comerciomap', {
      center: [parseFloat(LATITUDE), parseFloat(LONGITUDE)],
      zoom: 15,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18
    }).addTo(this.map);

    if (lat && lng) {
      let icon = L.divIcon({className: 'saleMapMarker'});
      this.marker = L.marker([lat, lng], { draggable: true, icon })
        .addTo(this.map);

      this.map.setView([lat, lng]);
    }

    this.comercios = L.layerGroup().addTo(this.map);

    comercios.forEach(c => {
      let icon = L.divIcon({className: 'comercioMapMarker'});
      L.marker([c.latitud, c.longitud], {draggable: false, icon})
        .on('click', () => this.props.onSelectComercio(c))
        .addTo(this.comercios);
    });
  }

  componentDidUpdate() {
    const { lat, lng, comercios } = this.props;

    this.comercios.clearLayers();

    if (lat && lng) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      let icon = L.divIcon({className: 'saleMapMarker'});
      this.marker = L.marker([lat, lng], { draggable: false, icon })
        .addTo(this.map);

      this.map.setView([lat, lng]);
    }

    comercios.forEach(c => {
      let icon = L.divIcon({className: 'comercioMapMarker'});
      L.marker([c.latitud, c.longitud], {draggable: false, icon})
        .on('click', () => this.props.onSelectComercio(c))
        .addTo(this.comercios);
    });
  }

  render() {
    return (
      <div id='comerciomap' style={{ width: '100%', height: '100%', zIndex: 0 }}/>
    );
  }
}
