import * as React from 'react';
import * as L from 'leaflet';
import { Polygon, Popup } from 'react-leaflet';

import * as styles from './styles.css';
import { Mapping, LatLng } from '../../../shared/components/Mapping';
import { RoutedOuterWrapper as OuterWrapper } from '../../../shared/layouts/OuterWrapper';
import ZonasService from '../../../services/zonas';
import { Zona, ZonaInput, Polygon as IPolygon } from '../../../types';
import { ZonaFormInput } from './ZonaFormInput';

type IEditable<T> = { [P in keyof T]?: T[P] };

interface State {
	zoom: number;
	zonas: Array<Zona>;
	coords: LatLng;
	showAll: boolean;
	activeZonaId: number;
	editableZona: IEditable<ZonaInput>;
}

export class DefinirZona extends React.Component<any, State> {
	marker: L.DivIcon = L.divIcon({ className: 'saleMapMarker' });

	constructor(props) {
		super(props);
		this.state = {
			zoom: 15,
			zonas: [],
			coords: {
				lat: parseFloat(process.env.LATITUDE),
				lng: parseFloat(process.env.LONGITUDE)
			},
			showAll: false,
			activeZonaId: null,
			editableZona: null
		};
	}

	async componentDidMount() {
		const zonas = await ZonasService.getZonas();

		this.setState({ zonas });
	}

	onSave = async () => {
		// const { zonas, activeZonaId, editableZona } = this.state;
		//
		// let zona;
		//
		// if (activeZonaId) {
		// 	const updatedZona: ZonaInput = {
		// 		ZonaNombre: editableZona.ZonaNombre,
		// 		limites: editableZona.limites,
		// 		color: editableZona.color
		// 	};
		//
		// 	zona = await ZonasService.updateZona(updatedZona, activeZonaId);
		//
		// 	zonas.splice(zonas.findIndex((z) => z.ZonaID === zona.ZonaID), 1, zona);
		//
		// 	this.setState({
		// 		activeZonaId: null,
		// 		editableZona: null
		// 	});
		// } else {
		// 	const newZona: ZonaInput = {
		// 		ZonaNombre: editableZona.ZonaNombre,
		// 		limites: editableZona.limites,
		// 		color: editableZona.color
		// 	};
		//
		// 	zona = await ZonasService.createZona(newZona);
		//
		// 	this.setState({
		// 		zonas: [ ...zonas, zona ],
		// 		activeZonaId: null,
		// 		editableZona: null
		// 	});
		// }
	};

	onDelete = async (id: number) => {
		const deletedZona = await ZonasService.removeZona(id);

		if (deletedZona) {
			this.setState({ activeZonaId: null });
		}
	};

	onEditField = (key: string, value) => {
		const { editableZona = {} } = this.state;

		this.setState({
			editableZona: {
				...editableZona,
				[key]: value
			}
		});
	};

	onPolygonCreated = async (coords) => {
		this.onEditField('limites', JSON.stringify(coords));
	};

	onDoubleClick = (e) => {
		const coords = {
			lat: e.latlng.lat,
			lng: e.latlng.lng
		};

		this.setState({ coords });
	};

	getPolygonCoords = (limites: string): IPolygon => {
		const coords = [];

		JSON.parse(limites).forEach((p) => {
			p.forEach((c) => {
				coords.push([ c.lat, c.lng ]);
			});
		});

		return {
			coords
		};
	};

	render() {
		const { coords, zonas, showAll, activeZonaId, editableZona } = this.state;
		const zonasOptions = zonas.filter((z) => !z.limites).map((z) => {
			return {
				value: z.zona_id,
				label: z.zona_nombre
			};
		});

		zonasOptions.unshift({
			value: 0,
			label: ''
		});

		return (
			<OuterWrapper>
					<div className={styles.container}>
						<div className={styles.ZonasForm}>
							<h3 className={styles.ZonasTitle}>Zonas</h3>
							{zonas.map((z) => {
								return activeZonaId === z.zona_id ? (
									<ZonaFormInput
										zona={{ ...z, ...editableZona }}
										onSave={this.onSave}
										onCancel={() => this.setState({ activeZonaId: null, editableZona: null })}
										onEditField={this.onEditField}
										key={z.zona_id}
									/>
								) : (
									<div className={styles.ZonaFieldGroup} key={z.zona_id}>
										<div className={styles.GroupHeader}>
											<svg className={styles.ellipsis}>
												<use xlinkHref={`/assets/images/sprite.svg#icon-ellipsis-h`} />
											</svg>
											<div className={styles.GroupActions}>
												<div
													className={styles.Action}
													onClick={() =>
														this.setState({ activeZonaId: z.zona_id, editableZona: z })}
												>
													Editar
												</div>
												<div className={styles.Action} onClick={() => this.onDelete(z.zona_id)}>
													Eliminar
												</div>
											</div>
										</div>
										<div className={styles.label}>
											{z.zona_nombre}
											{z.color && (
												<div className={styles.color} style={{ backgroundColor: z.color }} />
											)}
										</div>
									</div>
								);
							})}
						</div>
						<Mapping
							zoom={15}
							center={{ lat: coords.lat, lng: coords.lng }}
							onDoubleClick={this.onDoubleClick}
							onPolygonCreated={this.onPolygonCreated}
						>
							{activeZonaId &&
							editableZona.limites && (
								<Polygon positions={JSON.parse(editableZona.limites)} color={editableZona.color} />
							)}
							{showAll &&
								zonas.map((z) => {
									if (z.limites) {
										return (
											<Polygon key={z.zona_id} positions={JSON.parse(z.limites)} color={z.color}>
												<Popup>{z.zona_nombre}</Popup>
											</Polygon>
										);
									}
								})}
						</Mapping>
						<div className={styles.checkbox}>
							<input
								type="checkbox"
								checked={showAll}
								onChange={() => this.setState({ showAll: !showAll })}
							/>{' '}
							Ver todas
						</div>
					</div>
			</OuterWrapper>
		);
	}
}
