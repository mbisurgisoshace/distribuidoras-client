import * as React from 'react';
import * as styles from './styles.css';
import * as classnames from 'classnames';
import * as uuidv4 from 'uuid/v4';

type CheckboxSizes = 'medium' | 'small';

interface CheckboxProps {
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
  children?: any;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  formControl?: boolean;
  size?: CheckboxSizes;
  readOnly?: boolean;
  indeterminate?: boolean;
  fluid?: boolean;
}

export class Checkbox extends React.Component<CheckboxProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id || uuidv4()
    };
  }

  render() {
    let {
        size = 'medium',
        formControl,
        disabled,
        checked,
        onChange,
        children,
        name,
        readOnly,
        fluid = false,
        indeterminate = false
      } = this.props,
      id = this.state.id;

    return (
      <label
        htmlFor={id}
        className={classnames('checkbox-component', styles.Checkbox, {
          [styles.formControl]: formControl,
          [styles.medium]: size == 'medium',
          [styles.small]: size == 'small',
          [styles.fluid]: fluid
        })}
      >
        {!(readOnly || disabled) && (
          <input type="checkbox" id={id} checked={checked} onChange={onChange} name={name} />
        )}
        <div
          className={classnames(styles.CheckboxContent, {
            [styles.Disabled]: disabled,
            [styles.Checked]: checked
          })}
        >
          <div className={styles.CheckboxBox}>
            {checked && !indeterminate && (
              <div className={styles.CheckboxFill}>

              </div>
            )}
            {indeterminate && (
              <div className={styles.CheckboxFill}>
                <i className={'fas fa-minus'} />
              </div>
            )}
          </div>

          {children && <div className={styles.CheckboxLabel}>{children}</div>}
        </div>
      </label>
    );
  }
}
