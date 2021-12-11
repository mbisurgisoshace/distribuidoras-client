// @ts-nocheck
import * as React from 'react';
import Select from 'react-select';
import * as numeral from 'numeral';
import Table from '../../../shared/components/Table';

import * as styles from './styles.css';
import { MovimientoItem, Precio } from '../../../types';
import { Button } from '../../../shared/components/Button';

interface FormDetailProps {
  onGuardar: () => void;
  precios: Array<Precio>;
  envases: Array<{ value: number, label: string }>;
}

export const FormDetail = React.forwardRef<any, FormDetailProps>(({ onGuardar, envases, precios }, ref) => {
  const [data, setData] = React.useState(precios || []);
  React.useImperativeHandle(ref, () => ({getItems: () => {return data}}), [data]);

  React.useEffect(() => {
    setData(precios);
  }, [precios]);

  const ComboBoxEditableCell = ({ value: initialValue, row: { index }, column: { id }, updateMyData }) => {
    const options = envases;

    const initialOption = options.find(o => o.value === initialValue);

    const [value, setValue] = React.useState(initialOption);

    const onChange = e => {
      setValue(e);
      updateMyData(index, id, e.value);
    };

    const onBlur = () => {
      //updateMyData(index, id, value)
    };

    React.useEffect(() => {
      setValue(initialOption);
    }, [initialValue]);

    return (
      <Select
        value={value}
        options={options}
        onChange={onChange}
        classNamePrefix='react-select'
        className='react-select-container'
      />
    );
  };

  const TextEditableCell = ({ value: initialValue, row: { index }, column: { id }, updateMyData }) => {
    const [value, setValue] = React.useState(initialValue);

    const onChange = e => {
      setValue(e.target.value);
      updateMyData(index, id, e.target.value);
    };

    const onBlur = () => {
      updateMyData(index, id, value);
    };

    const onFocus = () => {
      updateMyData(index, id, numeral(value).value() || '');
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input className={styles.Input} value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />;
  };

  const columns = React.useMemo(() => [
    {
      Header: 'Envase',
      accessor: 'envase_id',
      width: 400,
      Cell: ComboBoxEditableCell
    },
    {
      Header: 'Precio U.',
      accessor: 'precio',
      width: 200,
      Cell: TextEditableCell
    },
    // {
    //   Header: '',
    //   accessor: 'actions',
    //   width: 75,
    //   Cell: (cell) => {
    //     const i = cell.row.index;
    //     return (
    //       <div style={{textAlign: 'center'}}>
    //         <span className={styles.eliminar} onClick={() => onDelete(i, cell.data)}
    //         >
    //         eliminar
    //       </span>
    //       </div>
    //     );
    //   }
    // }
  ], [envases]);

  const updateMyData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  const onAdd = () => {
    setData([
      ...data,
      { envase_id: '', precio: 0 }
    ]);

    const cell = document.getElementById(`${data.length}-envase_id`);

    if (cell) {
      const input = cell.getElementsByClassName('react-select__input')[0].getElementsByTagName('input')[0];
      input.focus();
    }
  };

  const onDelete = (index, currData) => {
    currData.splice(index, 1);
    setData([
      ...currData
    ])
  }

  return (
    <div className={styles.DetalleWrapper}>
      <div className={styles.DetalleWrapperHeader}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <h3>Detalle Lista</h3>
          <svg className={styles.Icons} onClick={onAdd}>
            <use xlinkHref={`/assets/images/sprite.svg#icon-plus-solid`}></use>
          </svg>
        </div>
        <Button size={'tiny'} onClick={onGuardar}>Guardar</Button>
      </div>
      <Table data={data} columns={columns} updateMyData={updateMyData} lastCellKey={'precio'} onLastCellTabbed={onAdd} />
    </div>
  );
});
