import * as React from 'react';
import * as styles from './styles.css';
import * as classNames from 'classnames';
import { Cliente } from '../../../types';

interface SearchResultItemProps {
  style: any;
  isSelected: boolean;
  cliente: Cliente;
  onSelectItem: (item) => void;
}

export const SearchResultItem = ({style, cliente, isSelected, onSelectItem}: SearchResultItemProps) => {
  return (
    <div style={style} className={classNames(styles.ListGroupItem, isSelected ? styles.active : '')} onClick={onSelectItem}>
      <p style={{width: 75}}>{cliente.cliente_id}</p>
      <p style={{width: 200}}>{cliente.razon_social}</p>
      <p style={{width: 250}}>{`${cliente.calle} ${cliente.altura}`}</p>
      <p style={{width: 100}}>{cliente.telefono}</p>
    </div>
  )
}
