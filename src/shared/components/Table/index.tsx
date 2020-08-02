import * as React from 'react';
import * as classnames from 'classnames';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as styles from './styles.css';

interface TableProps {
  data: Array<object>;
  columns: Array<object>;
  loading?: boolean;
  noDataText?: string;
  loadingText?: string;
  filterable?: boolean;
}

const Table = ({
                 data,
                 columns,
                 loading,
                 noDataText,
                 loadingText,
                 filterable
               }: TableProps) => (
  <div className={styles.Table}>
    <ReactTable
      previousText='Anterior'
      nextText='Siguiente'
      pageText='Pagina'
      rowsText='filas'
      loading={loading}
      noDataText={loading ? '' : noDataText}
      loadingText={loadingText}
      className={classnames('-striped -highlight')}
      columns={columns}
      filterable={filterable}
      data={data}/>
  </div>
);

export default Table;
