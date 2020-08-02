import * as React from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import * as styles from './styles.css';

interface Props {
	color: string;
	onChange?: (c: ColorResult) => void;
}

interface State {
	showColorPicker: boolean;
}

export class ColorPicker extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			showColorPicker: false
		};
	}

	render() {
		return (
			<div className={styles.ColorPicker}>
				<div
					className={styles.colorSample}
					style={{ backgroundColor: this.props.color }}
					onMouseDown={() => {
						let showColorPicker = !this.state.showColorPicker;
						this.setState({ showColorPicker });
					}}
				/>
				{this.state.showColorPicker && (
					<div className={styles.colorPopout}>
						<SketchPicker
							color={this.props.color}
							onChange={(c: ColorResult) => {
								if (this.props.onChange) this.props.onChange(c);
							}}
							onChangeComplete={(c:ColorResult) => {
								this.setState({ showColorPicker: false });
								if (this.props.onChange) this.props.onChange(c);
							}}
						/>
					</div>
				)}
			</div>
		);
	}
}
