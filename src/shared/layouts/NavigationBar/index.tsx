import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classnames from 'classnames';

import * as styles from './styles.css';

const ContainerWithNavigation = ({ children, className = '' }) => (
	<div className={classnames(styles.ContainerWithNavigation, className)}>{children}</div>
);

export class NavigationBar extends React.Component<any, any> {
	public static Container = ContainerWithNavigation;

	render() {
		return (
			<div className={styles.NavigationBar}>
				<svg className={styles.NavigationBarLogo}>
					<use xlinkHref="/assets/images/sprite.svg#icon-byb" />
				</svg>
				<div className={styles.NavigationBarUserInfo}>
					{localStorage.getItem('__USERNAME__')}
					<Link to="/logout">
						<svg className={styles.NavigationBarIcon}>
							<use xlinkHref="/assets/images/sprite.svg#icon-power-off-solid" />
						</svg>
					</Link>
				</div>
			</div>
		);
	}
}
