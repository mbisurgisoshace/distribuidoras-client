import * as React from 'react';
import * as classnames from 'classnames';

import * as styles from './styles.css';

type HTMLButtonType = 'submit' | 'reset' | 'button';
type ButtonType = 'primary' | 'secondary' | 'default' | 'light' | 'danger';
type ButtonSize = 'medium' | 'small' | 'tiny';

interface ButtonProps {
	onClick?: () => void;
	size?: ButtonSize;
	type?: ButtonType;
	buttonType?: HTMLButtonType;
	disabled?: boolean;
	className?: string;
	outline?: boolean;
}

export class Button extends React.Component<ButtonProps> {
	render() {
		const { size = 'medium', type = 'primary', buttonType = 'button', onClick, disabled = false, className, outline = false } = this.props;

		return (
			<button
				className={classnames(
					styles.Button,
					className,
					{
						[styles.medium]: size == 'medium',
						[styles.small]: size == 'small',
						[styles.tiny]: size == 'tiny'
					},
					{
						[styles.primary]: type == 'primary',
						[styles.secondary]: type == 'secondary'
					},
					{
						[styles.outline]: outline
					},
					{
						[styles.disabled]: disabled
					}
				)}
				onClick={onClick}
				disabled={disabled}
				type={buttonType}
			>
				{this.props.children}
			</button>
		);
	}
}
