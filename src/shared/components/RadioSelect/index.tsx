import * as React from 'react';

import * as styles from './styles.css';
import { Checkbox } from '../Checkbox';

interface RadioOption {
  label: string;
  value: string;
  component?: any;
}

interface RadioSelectProps {
  value: string | number;
  options: Array<RadioOption>;
  onChange: (option: any) => void;
}

export const RadioSelect: React.FunctionComponent<RadioSelectProps> =
  ({
     value,
     options,
     onChange
   }) => {
    const onOptionChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.name;
      if (value === newValue) {
        onChange(null);
      } else {
        onChange(newValue);
      }
    }

    return (
      <div className={styles.RadioSelect}>
        {options.map(o => {
          return (
            <div key={o.value} className={styles.RadioOption}>
              <Checkbox checked={value == o.value} name={o.value} onChange={onOptionChange}>{o.label}</Checkbox>
              {o.component && value == o.value && (
                <div className={styles.RadioOptionComponent}>
                  {o.component}
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
  };
