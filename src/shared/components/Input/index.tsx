import * as React from 'react';
import * as styles from './styles.css';
import * as classnames from 'classnames';
import { Icon } from '../Icon';
import * as uuidv4 from 'uuid/v4';

type InputSizes = 'medium' | 'small';

export interface InputProps {
  id?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string;
  type?: string;
  min?: string;
  max?: string;
  size?: InputSizes;
  fluid?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  fixedLabel?: boolean;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  iconRight?: string;
  multiline?: boolean;
  readOnly?: boolean;
  onChange?: Function;
  onClick?: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
  onFocus?: Function;
  onBlur?: Function;
  onKeyDown?: React.EventHandler<React.KeyboardEvent<HTMLInputElement>>;
  onKeyPress?: React.EventHandler<React.KeyboardEvent<HTMLInputElement>>;
  autoFocus?: boolean;
  maxLength?: number;
  readonly?: boolean;
  width?: number;
}

export interface InputState {
  id: string;
  isFocused: boolean;
}

export class Input extends React.Component<InputProps, InputState> {
  private input;

  constructor(props) {
    super(props);

    this.state = {
      id: props.id || uuidv4(),
      isFocused: false
    };

    this.setFocus = this.setFocus.bind(this);
  }

  setFocus(value, e) {
    if (value && this.props.onFocus) {
      this.props.onFocus(e);
    }
    if (!value && this.props.onBlur) {
      this.props.onBlur(e);
    }

    this.setState({
      isFocused: value
    });
  }

  render() {
    let {
        size = 'medium',
        fluid = false,
        disabled = false,
        error = false,
        fixedLabel = false,
        multiline = false,
        readOnly = false,
        autoFocus = false,
        name = '',
        className = '',
        defaultValue,
        value,
        type,
        min,
        max,
        iconRight,
        label,
        placeholder,
        errorMessage,
        onChange,
        onKeyDown,
        onKeyPress,
        onClick,
        maxLength,
        width,
        ...restProps
      } = this.props,
      { id, isFocused } = this.state;

    isFocused = isFocused || className.indexOf('react-datepicker-ignore-onclickoutside') != -1; //needed for Datepicker component

    let isLabelFixed = placeholder || fixedLabel || (value && value.toString()) || isFocused;
    let InputElement = multiline ? 'textarea' : 'input';

    return (
      <div
        className={classnames(
          'input-component',
          styles.InputContainer,
          {
            [styles.medium]: size == 'medium',
            [styles.small]: size == 'small',
            [styles.fluid]: fluid,
            [styles.focused]: isFocused,
            [styles.hasError]: error,
            [styles.hasFixedLabel]: isLabelFixed,
            [styles.hasFloatingLabel]: !isLabelFixed,
            [styles.iconRight]: !!iconRight,
            [styles.disabled]: disabled
          },
          className
        )}
				style={{width: width ? `${width}%` : ''}}
        onClick={onClick}
      >
        <InputElement
          {...restProps}
          name={name}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyPress={onKeyPress}
          type={type}
          min={min}
          max={max}
          id={id}
          className={styles.inputElement}
          onBlur={e => this.setFocus(false, e)}
          onFocus={e => this.setFocus(true, e)}
          readOnly={readOnly || !onChange}
          autoFocus={autoFocus}
          ref={e => {
            this.input = e;
          }}
          maxLength={maxLength}
          defaultValue={defaultValue}
        />
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        {error && errorMessage && <span className={styles.error}>{errorMessage}</span>}
        {iconRight && (
          <Icon
            onClick={() => {
              this.input.focus();
            }}
            icon={iconRight}
          />
        )}
      </div>
    );
  }
}
