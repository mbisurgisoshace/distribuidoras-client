import * as React from 'react';
import * as L from 'leaflet';
import * as geocoder from 'esri-leaflet-geocoder';
import { GeoSearchControl, EsriProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/assets/css/leaflet.css';

const provider = new EsriProvider();
const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

interface ComercioMapProps {
  lat: number;
  lng: number;
  onlyView?: boolean;
  onSetCoords?: (lat: number, lng: number) => void;
  onLocationChanged?: (lat: number, lng: number, calle?: string, altura?: string, localidad?: string, cp?: string, provincia?: string) => void;
}

export default class ComercioMap extends React.Component<ComercioMapProps> {
  map = null;
  marker = null;
  searchControl = null;

  constructor(props) {
    super(props);
    let icon = L.divIcon({className: 'saleMapMarker'});

    this.searchControl = new GeoSearchControl({
      provider,
      showMarker: true,
      marker: {
        icon: icon,
        draggable: true
      },
      style: 'bar',
      autoClose: true,
      keepResult: true,
      searchLabel: 'Buscar direccion'
    });
  }

  onLocationFound = (e) => {
    if (this.marker) {
      this.marker.remove();
    }

    const lat = e.location.y;
    const lng = e.location.x;

    this.props.onLocationChanged(lat, lng);

    (geocoder as any).geocode().text(e.location.label).run((err, res, response) => {
      if (err) {
        this.props.onLocationChanged(lat, lng);
        return;
      }

      let results = res.results;
      if (results) {
        const { StName, AddNum, Nbrhd, Postal, Region } = results[0].properties;
        this.props.onLocationChanged(lat, lng, StName, AddNum, Nbrhd, Postal, Region);
      } else {
        this.props.onLocationChanged(lat, lng);
      }
    });
  };

  onSearchMarkerMove = (e) => {
    const lat = e.location.lat;
    const lng = e.location.lng;
    this.props.onSetCoords(lat, lng);
  };

  onMarkerMove = (e) => {
    const { lat, lng } = e.target.getLatLng();
    this.props.onSetCoords(lat, lng);
  };

  componentDidMount() {
    const { lat, lng, onlyView } = this.props;

    this.map = L.map('comerciomap', {
      center: [parseFloat(LATITUDE), parseFloat(LONGITUDE)],
      zoom: 16,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18
    }).addTo(this.map);

    if (!onlyView) {
      this.map.addControl(this.searchControl);
      this.map.on('geosearch/showlocation', this.onLocationFound);
      this.map.on('geosearch/marker/dragend', this.onSearchMarkerMove);
    }

    if (lat && lng) {
      let icon = L.divIcon({className: 'saleMapMarker'});
      this.marker = L.marker([lat, lng], { draggable: true, icon })
        .addTo(this.map);

      this.marker.on('dragend', this.onMarkerMove);

      this.map.setView([lat, lng]);
    }
  }

  componentDidUpdate() {
    const { lat, lng, onlyView } = this.props;

    if (lat && lng && onlyView) {
      let icon = L.divIcon({className: 'saleMapMarker'});
      this.marker = L.marker([lat, lng], { draggable: false, icon })
        .addTo(this.map);

      this.marker.on('dragend', this.onMarkerMove);

      this.map.setView([lat, lng]);
    }
  }

  render() {
    return (
      <div id='comerciomap' style={{ width: '100%', height: '100%', zIndex: 0 }}/>
    );
  }
}
