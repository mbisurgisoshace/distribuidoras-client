import * as React from 'react';

import * as styles from './styles.css';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { ColorPicker } from '../../../shared/components/ColorPicker';
import { Zona } from '../../../types';

interface Props {
	zona: Zona;
	onSave: () => void;
	onCancel: () => void;
	onEditField: (key: string, value) => void;
}

export class ZonaFormInput extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	onNombreChange = (e) => {
		this.props.onEditField('ZonaNombre', e.target.value);
	};

	onColorChange = (c) => {
		this.props.onEditField('color', c.hex);
	};

	render() {
		const { zona, onSave, onCancel } = this.props;

		return (
			<div>
				{/*<Input size="small" value={zona.ZonaNombre} onChange={this.onNombreChange} />*/}
				{/*<ColorPicker color={zona.color || '#fff'} onChange={this.onColorChange} />*/}
				{/*<div className={styles.buttonContainer}>*/}
				{/*	<Button size="tiny" type="secondary" onClick={onCancel} className={styles.cancelBtn}>*/}
				{/*		Cancelar*/}
				{/*	</Button>*/}
				{/*	<Button size="tiny" onClick={onSave}>*/}
				{/*		Guardar*/}
				{/*	</Button>*/}
				{/*</div>*/}
			</div>
		);
	}
}
