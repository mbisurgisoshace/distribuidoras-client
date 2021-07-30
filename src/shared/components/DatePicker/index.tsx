import * as React from 'react';
import * as moment from 'moment';
import RDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '../Input';

type DatePickerSizes = 'medium' | 'small';

export interface DatePickerProps {
  id?: string;
  value: string;
  onChange?: Function;
  format?: string;
  disabled?: boolean;
  className?: string;
  //Input Props:
  size?: DatePickerSizes;
  fluid?: boolean;
  name?: string;
  label?: string;
  fixedLabel?: boolean;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  iconRight?: string;
  readOnly?: boolean;
  onFocus?: Function;
  onBlur?: Function;
}

export class DatePicker extends React.Component<DatePickerProps, any> {
  getCustomInput = () => {
    let {
      size = 'medium',
      fluid = false,
      error = false,
      fixedLabel = false,
      readOnly = false,
      name = ''
    } = this.props;

    return (
      <Input
        {...this.props as any}
        {...{
          size,
          fluid,
          error,
          fixedLabel,
          readOnly,
          name
        }}
      />
    );
  };

  onChange = (momentValue) => {
    if (typeof this.props.onChange == 'function') {
      this.props.onChange({
        target: {
          name: this.props.name,
          value: momentValue ? moment(momentValue).format('DD-MM-YYYY') : ''
        }
      });
    }
  };

  render() {
    const { value } = this.props;
    let momentValue = moment(value, 'DD/MM/YYYY');

    if (!momentValue.isValid()) {
      momentValue = null;
    }

    return (
      <RDatePicker
        customInput={this.getCustomInput()}
        onChange={this.onChange}
        selected={momentValue ? momentValue.toDate() : null}
        dateFormat={'dd/MM/yyyy'}
      />
    );
  }
}
