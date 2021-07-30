import * as React from 'react';
import * as styles from './styles.css';
import * as classnames from 'classnames';
import ReactSelect, { components } from 'react-select';
import { Icon } from '../Icon';
import * as uuidv4 from 'uuid/v4';
import { LoadingIndicator } from '../LoadingIndicator';
import { Checkbox } from '../Checkbox';

type SelectSizes = 'medium' | 'small';

type SelectOption = {
  label: string;
  value: any;
};

export interface SelectProps {
  id?: string;
  name?: string;
  value: any;
  size?: SelectSizes;
  fluid?: boolean;
  onChange?: Function;
  disabled?: boolean;
  options: Array<SelectOption>;
  className?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  multiple?: boolean;
  clearable?: boolean;
  formControl?: boolean;
  dark?: boolean;
  light?: boolean;
  onFocus?: Function;
  onBlur?: Function;
}

export interface SelectState {
  id: string;
  isFocused: boolean;
}

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {/*<Icon icon="fas fa-sort-down" />*/}
      </components.DropdownIndicator>
    )
  );
};

const Placeholder = props => {
  return <components.Placeholder {...props} />;
};

const MultiValueLabel = props => {
  // let selectedValues = props.selectProps.value;
  // let isFirst = false;
  // if (selectedValues.indexOf(props.data) == 0) {
  //   isFirst = true;
  // }
  // return (
  //   <components.MultiValueLabel {...props}>{`${
  //     isFirst ? selectedValues.map(e => e.value).join(', ') : ''
  //   }`}</components.MultiValueLabel>
  // );
  let selectedValues = props.selectProps.value;

  let isFirst = false;
  if (selectedValues.indexOf(props.data) === 0) {
    isFirst = true;
  }

  return (
    <components.MultiValueLabel {...props}>{`${
      isFirst ? selectedValues.map((e: any) => e.label).join(', ') : ''
    }`}</components.MultiValueLabel>
  );
};

const Option = props => {
  // return (
  //   <components.Option {...props}>
  //     {props.children}
  //   </components.Option>
  // );
  return (
    <components.Option {...props}>
      {props.isMulti ? (
        <Checkbox readOnly checked={props.isSelected}>
          {props.children}
        </Checkbox>
      ) : (
        props.children
      )}
    </components.Option>
  );
};

export class Select extends React.Component<SelectProps, SelectState> {
  private select;
  private wrapper;

  constructor(props) {
    super(props);

    this.state = {
      id: props.id || uuidv4(),
      isFocused: false
    };

    this.setFocus = this.setFocus.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  checkValue(value, options) {
    const { multiple = false } = this.props;

    if (multiple && value && Array.isArray(value) && value.length > 0) {
      let arr = [];
      options.forEach(item => {
        if (value.indexOf(item.value) !== -1) {
          arr.push(item);
        }
      });
      value = arr;
    } else {
      let valueIndex = options.map(opt => opt.value).indexOf(value);
      if (valueIndex != -1) {
        value = options[valueIndex];
      }
    }

    return value;
  }

  setFocus(value, e) {
    if (value && typeof this.props.onFocus == 'function') {
      this.props.onFocus(e);
    }

    if (!value && typeof this.props.onBlur == 'function') {
      this.props.onBlur(e);
    }

    this.setState({
      isFocused: value
    });
  }

  onChange(objValue) {
    if (typeof this.props.onChange == 'function') {
      this.props.onChange({
        target: {
          name: this.props.name,
          value:
            !objValue || Array.isArray(objValue) ? objValue.map(opt => opt.value) : objValue.value
        }
      });
    }
    // if (typeof onChange == 'function') {
    //   onChange({
    //     target: {
    //       name: name,
    //       value: !option || Array.isArray(option) ? option.map(opt => opt.value) : option.value
    //     }
    //   });
    // }
  }

  render() {
    let {
      size = 'medium',
      fluid = false,
      disabled = false,
      multiple = false,
      clearable = false,
      error = false,
      formControl = false,
      name = '',
      dark = false,
      light = false,
      className = '',
      value,
      options,
      label,
      placeholder,
      errorMessage
    } = this.props;

    let { id } = this.state;

    value = this.checkValue(value, options);

    return (
      <div
        className={classnames(
          'select-component',
          styles.SelectContainer,
          {
            [styles.medium]: size == 'medium',
            [styles.small]: size == 'small',
            [styles.fluid]: fluid,
            [styles.multi]: multiple,
            [styles.focused]: this.state.isFocused,
            [styles.hasError]: error,
            [styles.disabled]: disabled,
            [styles.hasLabel]: label,
            [styles.formControl]: formControl,
            [styles.dark]: dark,
            [styles.light]: light
          },
          className
        )}
        id={id}
        ref={e => (this.wrapper = e)}
      >
        <ReactSelect
          hideSelectedOptions={false}
          onFocus={e => this.setFocus(true, e)}
          onBlur={e => this.setFocus(false, e)}
          name={name}
          isDisabled={disabled}
          isMulti={multiple}
          closeMenuOnSelect={!multiple}
          isSearchable={false}
          isClearable={clearable}
          value={value}
          options={options}
          placeholder={placeholder}
          onChange={this.onChange}
          className="react-select"
          classNamePrefix="react-select"
          ref={ref => {
            this.select = ref;
          }}
          components={{ DropdownIndicator, Placeholder, MultiValueLabel, Option }}
        />
        {label && (
          <label onClick={() => !disabled && this.select.focus()} className={styles.label}>
            {label}
          </label>
        )}
        {error && errorMessage && <span className={styles.error}>{errorMessage}</span>}
      </div>
    );
  }
}
