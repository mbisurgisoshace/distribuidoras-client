// @ts-nocheck
import * as React from 'react';
import { useTable } from 'react-table';

import './styles.css';

interface TableProps {
  data: any;
  columns: any;
  updateMyData?: any;
  lastCellKey?: string;
  onLastCellTabbed?: Function;
}

const Table = ({data, columns, updateMyData, lastCellKey, onLastCellTabbed}: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow
  } = useTable({data, columns, updateMyData});

  const onBlur = (ev, cell, rowsLength) => {
    if (ev.keyCode === 9 && lastCellKey && onLastCellTabbed) {
      if (cell.column.id === lastCellKey && cell.row.index === rowsLength - 1) {
        onLastCellTabbed();
      }
    }
  }

  return (
    <div className={'TableContainer'}>
      <table {...getTableProps()}>
        <thead>
        <tr>
          {headers.map(column => {
            return (
              <th {...column.getHeaderProps({style: {width: column.width}})}>
                {column.render('Header')}
              </th>
            )
          })}
        </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()} id={`${row.index}-${cell.column.id}`} onKeyDown={(e) => onBlur(e, cell, rows.length)}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}

export default Table;
