import * as React from 'react';
import * as L from 'leaflet';
import { Map, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet';
import 'leaflet.pm';
import 'leaflet/dist/leaflet.css';
import 'leaflet.pm/dist/leaflet.pm.css';

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
		// this.map.pm.addControls({
		// 	editMode: false,
		// 	cutPolygon: false,
		// 	drawCircle: false,
		// 	drawMarker: false,
		// 	drawPolyline: false,
		// 	drawRectangle: false
		// });
		//
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
					{/*{layerControl ? (*/}
					{/*	<LayersControl>*/}
					{/*		<TileLayer*/}
					{/*			url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"*/}
					{/*			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'*/}
					{/*		/>*/}
					{/*		{this.props.children}*/}
					{/*	</LayersControl>*/}
					{/*) : (*/}
					{/*	<div>*/}
					{/*		<TileLayer*/}
					{/*			url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"*/}
					{/*			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'*/}
					{/*		/>*/}
					{/*		{this.props.children}*/}
					{/*	</div>*/}
					{/*)}*/}
					<div>
						<TileLayer
							url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
						/>
						{this.props.children}
					</div>
				</Map>
			</div>
		);
	}
}
