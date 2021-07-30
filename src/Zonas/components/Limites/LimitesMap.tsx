import L from 'leaflet';
import * as React from 'react';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, Circle, FeatureGroup } from 'react-leaflet';

const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

export class LimitesMap extends React.Component<any, any> {
  map: any = null;
  leafletMap: any = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.map = this.leafletMap.leafletElement;
  }

  render() {
    return (
      <div style={{flex: 1, height: '100%'}}>
        <Map
          zoom={16}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          ref={(m) => (this.leafletMap = m)}
          center={[parseFloat(LATITUDE), parseFloat(LONGITUDE)]}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </Map>
      </div>
    )
  }
}
