import * as React from 'react';
import { Input } from '../Input';
import * as styles from './styles.css';
import * as classnames from 'classnames';
import { Cliente } from '../../../types';
import { SearchResultItem } from './SearchResultItem';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { List, ArrowKeyStepper} from 'react-virtualized';

interface ClientsInputSearchProps {
  clientes: Array<Cliente>
  onSelectClient: (cliente) => void;
}

export const ClientsInputSearch = ({ clientes, onSelectClient }: ClientsInputSearchProps) => {
  const [cursor, setCursor] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');

  const searchResultRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterBy = (search: string, key?: string) => {
    if (!key) return clientes;

    return clientes.filter(c => c[key] && c[key].toString().toLowerCase().includes(search));
  }

  const searchResults = useMemo(() => {
    if (!searchString) return clientes;

    if (searchString[0] === '-' && searchString[1]) {
      let filter = searchString[1];
      if (searchString.length > 3) {
        let search = searchString.substring(3, searchString.length);
        if (filter === 'a') {
          return filterBy(search, 'altura');
        }

        if (filter === 'c') {
          return filterBy(search, 'calle');
        }

        if (filter === 'r') {
          return filterBy(search, 'razon_social');
        }

        if (filter === 't') {
          return filterBy(search, 'telefono');
        }
      }
      return clientes;
    }

    return clientes.filter(c => {
      if (isNaN(parseInt(searchString))) {
        return c.razon_social && c.razon_social.toLowerCase().includes(searchString.toLowerCase()) ||
          c.calle && c.calle.toLowerCase().includes(searchString.toLowerCase());
      } else {
        return c.cliente_id.toString().includes(searchString.toLowerCase()) ||
          c.altura && c.altura.toLowerCase().includes(searchString.toLowerCase()) ||
          c.telefono && c.telefono.toLowerCase().includes(searchString.toLowerCase());
      }
    });
  }, [clientes, searchString]);

  const handleClickOutside = (e) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setIsVisible(false);
  };

  const keyboardNavigation = e => {
    if (e.key === 'ArrowDown') {
      isVisible ? navigate('down') : setIsVisible(true);
    }

    if (e.key === 'ArrowUp') {
      navigate('up');
    }

    if (e.key === 'Escape') {
      setIsVisible(false);
    }

    if (e.key === 'Enter' && cursor > -1) {
      setCursor(0);
      setIsVisible(false);
      setSearchString(searchResults[cursor].razon_social);
      onSelectClient(searchResults[cursor]);
    }
  };

  const navigate = (direction) => {
    if (direction === 'down' && cursor < searchResults.length - 1) {
      setCursor(cursor + 1);
    }

    if (direction === 'up') {
      if (cursor > 0) {
        setCursor(cursor - 1);
      } else {
        setCursor(0);
      }
    }
  };

  const rowRenderer = ({index, style}) => {
    const c = searchResults[index];

    return (
      <SearchResultItem
        cliente={c}
        style={style}
        key={c.cliente_id}
        isSelected={cursor === index}
        onSelectItem={() => {
          setIsVisible(false);
          setSearchString(c.razon_social);
          onSelectClient(c);
        }}/>
    );
  };

  const getFiltro = (key:string) => {
    if (key === 'a') {
      return 'Altura';
    }

    if (key === 'r') {
      return 'Razon Social';
    }

    if (key === 'c') {
      return 'Calle';
    }

    if (key === 't') {
      return 'Telefono';
    }
  }

  return (
    <div className={styles.ClientsInputSearch} ref={searchContainerRef}>
      {searchString[0] === '-' && searchString[1] && (
        <span className={styles.FiltrandoPor}>Filtrando por <span className={styles.Filtro}>{getFiltro(searchString[1])}</span></span>
      )}
      {searchString[0] !== '-' && (
        <span className={styles.FiltrandoPor}>Filtrando por <span className={styles.Filtro}>Todos</span></span>
      )}
      <Input
        fluid
        size={'small'}
        value={searchString}
        onClick={() => setIsVisible(true)}
        onKeyDown={keyboardNavigation}
        onChange={(e) => {
          setCursor(0);
          setSearchString(e.target.value);
        }}
        className={styles.InputSearch}
      />
      <div className={classnames(styles.SearchResults, isVisible ? styles.visible : styles.invisible)}>
        <div className={styles.SearchResultsHeader}>
          <div style={{width: 200}}>Razon Social</div>
          <div style={{width: 250}}>Domicilio</div>
          <div style={{width: 100}}>Telefono</div>
        </div>
        <ArrowKeyStepper
          mode={'cells'}
          columnCount={1}
          isControlled={false}
          scrollToColumn={1}
          scrollToRow={cursor}
          rowCount={searchResults.length}
          onScrollToChange={({scrollToRow}) => setCursor(scrollToRow)}
        >
          {({onSectionRendered, scrollToColumn, scrollToRow}) => (
            <List
              width={550}
              height={250}
              rowHeight={25}
              ref={searchResultRef}
              rowRenderer={rowRenderer}
              scrollToIndex={scrollToRow + 1}
              rowCount={searchResults.length}
              scrollToColumn={scrollToColumn}
              onSectionRendered={onSectionRendered}
            /> as ReactNode
          )}
        </ArrowKeyStepper>
      </div>
    </div>
  );
};
