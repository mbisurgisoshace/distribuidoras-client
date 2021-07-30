import * as React from 'react';

import * as styles from './styles.css';
import { Checkbox } from '../Checkbox';

interface CheckboxListProps {
  options: any[],
  selectedOptions: Set<string>,
  onChange: (o: any) => void,
  checkboxStyle?: string,
}

export const CheckboxList = (props: CheckboxListProps) => {
  const { options, onChange } = props;
  const [isAllSelected, setIsAllSelected] = React.useState<boolean>(
    options.map((opt: any) => opt.value).length === props.selectedOptions.size);
  const [selectedOptions, setSelectedOptions] = React.useState<Set<string>>(props.selectedOptions);

  React.useEffect(() => {
    setSelectedOptions(props.selectedOptions);
    setIsAllSelected(options.map((opt: any) => opt.value).length === props.selectedOptions.size);
  }, [props.selectedOptions]);

  const handleSelectAll = (val: boolean) => {
    options.forEach((option: any) => {
      if (val) selectedOptions.add(option.value);
      else selectedOptions.delete(option.value);
    });
    setIsAllSelected(val);
    setSelectedOptions(new Set(selectedOptions));
    onChange(selectedOptions);
  };

  const handleSingleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name;
    //console.log(value);

    if (selectedOptions.has(value)) {
      selectedOptions.delete(value);
      setIsAllSelected(false);
    } else {
      selectedOptions.add(value);
    }
    setSelectedOptions(new Set(selectedOptions));
    onChange(selectedOptions);
  };

  return (
    <div className={styles.CheckboxStatusOptions}>
      <Checkbox indeterminate={selectedOptions.size !== 0 && !isAllSelected} checked={isAllSelected}
                onChange={() => handleSelectAll(!isAllSelected)} name={''}>{'Todos'}</Checkbox>
      {options.map(o => (
        <Checkbox key={o.value} checked={selectedOptions.has(o.value)} onChange={handleSingleSelect}
                  name={o.value}>{o.label}</Checkbox>
      ))}
    </div>
  );
};
