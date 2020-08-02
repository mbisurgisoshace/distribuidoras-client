import * as React from 'react';
import * as L from 'leaflet';
import { Map, TileLayer, LayersControl } from 'react-leaflet';
// import 'leaflet.pm';
import 'leaflet/dist/leaflet.css';
// import 'leaflet.pm/dist/leaflet.pm.css';

import * as styles from './styles.css';

export interface LatLng {
	lat: number;
	lng: number;
}

interface MappingProps {
	zoom: number;
	center: any;
	layerControl?;
	onDoubleClick?: (e: L.LeafletMouseEvent) => void;
	onPolygonCreated?: (coords: Array<LatLng>) => void;
}

interface MappingState {
	isDrawing: boolean;
}

export class Mapping extends React.Component<MappingProps, MappingState> {
	map: any = null;
	leafletMap: any = null;

	constructor(props: MappingProps) {
		super(props);

		this.state = {
			isDrawing: false
		};
	}

	componentDidMount() {
		this.map = this.leafletMap.leafletElement;
		this.map.pm.addControls({
			editMode: false,
			cutPolygon: false,
			drawCircle: false,
			drawMarker: false,
			drawPolyline: false,
			drawRectangle: false
		});

		// this.map.on('pm:drawstart', (e) => {
		// 	this.setState({ isDrawing: true });
		// });
		//
		// this.map.on('pm:drawend', (e) => {
		// 	this.setState({ isDrawing: false });
		// });
		//
		// this.map.on('pm:create', (e) => {
		// 	if (e.shape === 'Poly' && this.props.onPolygonCreated) {
		// 		this.props.onPolygonCreated(e.layer.getLatLngs());
		// 		this.map.removeLayer(e.layer);
		// 	}
		// });
	}

	onClick = (e: L.LeafletMouseEvent) => {};

	render() {
		const { zoom, center, layerControl, onDoubleClick } = this.props;

		return (
			<div className={styles.MappingContainer}>
				<Map
					ref={(m) => (this.leafletMap = m)}
					onclick={this.onClick}
					ondblclick={onDoubleClick}
					center={center}
					zoom={zoom}
					scrollWheelZoom={true}
					doubleClickZoom={false}
				>
					{layerControl ? (
						<LayersControl>
							<TileLayer
								url="https://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWJpc3VyZ2kiLCJhIjoiY2pyMmc5eXJwMWFkYTN5cG5mYncyMm0wbiJ9.fUKiZzKcM2O6sFmkFzBjCw"
								attribution="&amp;copy <a href=&quot;http://mapbox.com&quot;>Mapbox</a> &amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
							/>
							{this.props.children}
						</LayersControl>
					) : (
						<div>
							<TileLayer
								url="https://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoibWJpc3VyZ2kiLCJhIjoiY2pyMmc5eXJwMWFkYTN5cG5mYncyMm0wbiJ9.fUKiZzKcM2O6sFmkFzBjCw"
								attribution="&amp;copy <a href=&quot;http://mapbox.com&quot;>Mapbox</a> &amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>"
							/>
							{this.props.children}
						</div>
					)}
				</Map>
			</div>
		);
	}
}
