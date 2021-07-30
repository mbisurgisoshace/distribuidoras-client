import * as L from 'leaflet';
import * as React from 'react';
import 'leaflet/dist/leaflet.css';

import { Cliente, Zona } from '../../types';
import { feature } from '@turf/turf';

const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

interface MapViewProps {
  zonas: any;
  clientes: Array<Cliente>;
}

export default class MapView extends React.Component<MapViewProps, any> {
  map = null;
  clientesLayer = L.layerGroup();

  componentDidMount() {
    const { zonas } = this.props;

    this.map = L.map('reportemap', {
      center: [parseFloat(LATITUDE), parseFloat(LONGITUDE)],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18
    }).addTo(this.map);

    L.geoJSON(zonas, {
      style: function(feature) {
        return { color: feature.properties.color };
      }
    }).addTo(this.map);

    this.clientesLayer.addTo(this.map);
  }

  shouldComponentUpdate(nextProps: Readonly<MapViewProps>, nextState: Readonly<any>, nextContext: any): boolean {
    return nextProps.clientes !== this.props.clientes;
  }

  componentDidUpdate(prevProps: Readonly<MapViewProps>, prevState: Readonly<any>, snapshot?: any) {
    this.clientesLayer.clearLayers();
    this.props.clientes.forEach(c => {
      const {latitud, longitud} = c;
      if (latitud && longitud) {
        let icon;
        switch (c.canal_id) {
          case 1:
            icon = L.divIcon({className: 'usuarioMarker'});
            break;
          case 2:
            icon = L.divIcon({className: 'comercioMarker'});
            break;
          case 3:
            icon = L.divIcon({className: 'industriaMarker'});
            break;
          case 4:
            icon = L.divIcon({className: 'granUsuarioMarker'});
            break;
          case 5:
            icon = L.divIcon({className: 'subdistribuidorMarker'});
            break;
          case 6:
            icon = L.divIcon({className: 'eessMarker'});
            break;
          case 7:
            icon = L.divIcon({className: 'puertaMarker'});
            break;
        }

        L.marker([latitud, longitud], { icon })
          .bindTooltip(`${c.razon_social}`, {
            direction: 'top'
          })
          .addTo(this.clientesLayer);
      }
    });
  }

  render() {
    return (
      <div id='reportemap' style={{ width: '100%', height: '100%', zIndex: 0 }} />
    );
  }
}
