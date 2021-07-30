// @ts-nocheck

import * as React from 'react';
import * as classnames from 'classnames';
import * as delay from 'delay';
import { Keyframes, animated } from 'react-spring/renderprops';

import * as styles from './styles.css';
import { SidebarGroup } from './SidebarGroup';
import { SidebarMenu } from './SidebarMenu';

interface SidebarProps {
	history: any;
	location: any;
	match: any;
}

interface SidebarState {
	expanded: any;
}

const AnimatedSidebar = Keyframes.Spring({
	// Slots can take arrays/chains,
	peek: [ { width: 60, from: { width: 60 }, delay: 500 }, { width: 60, delay: 800 } ],
	// single items,
	open: { delay: 0, width: 150 },
	// or async functions with side-effects
	close: async (call) => {
		await delay(0);
		await call({ delay: 0, width: 60 });
	}
});

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
	state = {
		expanded: undefined
	};

	render() {
		const { history, location, match } = this.props;
		const { expanded } = this.state;

		return (
			<AnimatedSidebar native state={expanded === undefined ? 'peek' : expanded ? 'open' : 'close'}>
				{({ width }) => (
					<animated.div className={classnames(styles.Sidebar)} style={{ width }}>
						<div>
							<SidebarGroup
								name="Tablas"
								icon="table-solid"
								expanded={expanded}
								group="/tablas"
								match={match}
							>
								<SidebarMenu
									menuitems={[
										{ href: '/clientes', title: 'Clientes', subgroup: 'clientes' },
										{ href: '/comercios', title: 'Puntos Entrega', subgroup: 'comercios' },
										// { href: '/tablas/zonas', title: 'Zonas', subgroup: 'zonas' },
										// { href: '/tablas/agregar', title: 'Ventas', subgroup: 'ventas' },
										// { href: '/stock/control', title: 'Stock', subgroup: 'stock' },
										// { href: '/tablas/eliminar', title: 'Comodatos', subgroup: 'comodatos' },
										// { href: '/tablas/eliminar', title: 'Seguridad', subgroup: 'seguridad' }
									]}
									title="Tablas"
									group="/tablas"
									match={match}
									expanded={expanded}
								/>
							</SidebarGroup>

							<SidebarGroup
								name="Ventas"
								icon="dollar-sign-solid"
								expanded={expanded}
								group="/ventas"
								match={match}
							>
								<SidebarMenu
									menuitems={[
										{ href: '/hojas', title: 'Hojas de Ruta', subgroup: 'hojas' },
										{ href: '/pedidos/new', title: 'Nuevo Pedido', subgroup: 'pedidos' },
										{ href: '/comercios/entregas', title: 'Monitor Entregas', subgroup: 'entregas' },
										// { href: '/ventas/agregar', title: 'Movimientos', subgroup: 'movimientos' },
										// { href: '/ventas/eliminar', title: 'Remitos', subgroup: 'remitos' },
										// { href: '/ventas/eliminar', title: 'Cierre Diario', subgroup: 'cierre' }
									]}
									title="Ventas"
									group="/ventas"
									match={match}
									expanded={expanded}
								/>
							</SidebarGroup>

							<SidebarGroup
								name="Stock"
								icon="box-open-solid"
								expanded={expanded}
								group="/stock"
								match={match}
							>
								<SidebarMenu
									menuitems={[
										{ href: '/stock/control', title: 'Control', subgroup: 'control' },
										{ href: '/stock/cierre', title: 'Cierre', subgroup: 'cierre' },
										{ href: '/comercios/stock/new', title: 'Stock P.E', subgroup: 'stock-pe' }
									]}
									title="Stock"
									group="/stock"
									match={match}
									expanded={expanded}
								/>
							</SidebarGroup>

							<SidebarGroup
								name="Comodatos"
								icon="box-open-solid"
								expanded={expanded}
								group="/comodatos"
								match={match}
							>
								<SidebarMenu
									menuitems={[
										{ href: '/comodatos/new', title: 'Comodatos', subgroup: 'comodatos' },
										{ href: '/comodatos/retiro', title: 'Retiros', subgroup: 'retiros' },
										{ href: '/comodatos/perdida', title: 'Perdidas', subgroup: 'perdidas' },
										{ href: '/comodatos/renovacion', title: 'Renovacion', subgroup: 'renovacion' },
										{ href: '/comodatos/gestion', title: 'Gestion Comodatos', subgroup: 'gestion-comodatos' },
									]}
									title="Comodatos"
									group="/comodatos"
									match={match}
									expanded={expanded}
								/>
							</SidebarGroup>
						</div>
						{/*<svg*/}
						{/*	className={classnames(styles.SidebarIcon, styles.SidebarChevron)}*/}
						{/*	onClick={() => {*/}
						{/*		this.setState({ expanded: !expanded });*/}
						{/*	}}*/}
						{/*>*/}
						{/*	<use*/}
						{/*		xlinkHref={`/assets/images/sprite.svg#icon-${expanded*/}
						{/*			? 'chevron-left-solid'*/}
						{/*			: 'chevron-right-solid'}`}*/}
						{/*	/>*/}
						{/*</svg>*/}
					</animated.div>
				)}
			</AnimatedSidebar>
		);
	}
}
