import * as React from 'react';
import { Button } from '../../../../shared/components/Button';
import { Modal } from '../../../../shared/components/Modal';
import numeral from 'numeral';
import * as moment from 'moment';
import * as styles from '../../PedidoForm/styles.css';
import * as stylesRemito from './styles.css';
import Table from '../../../../shared/components/Table';
import RemitosService from '../../../../services/remitos';

interface RemitosModalProps {
  items: any[];
  show: boolean;
  onCancel: () => void;
  onGenerar: (remitos) => void;
}

export const RemitosModal = ({show, items, onCancel, onGenerar}: RemitosModalProps) => {
  const [data, setData] = React.useState(items || []);
  const [itemsRemito, setItemsRemito] = React.useState([]);

  React.useEffect(() => {
    const getItems = async () => {
      const itemsRemito = await RemitosService.getItems(items.map(item => item.id_pedido));
      setItemsRemito(itemsRemito);
    }

    getItems();
  }, []);

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
      //updateMyData(index, id, numeral(value).value() || '');
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input className={styles.Input} value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />;
  };
  console.log('itemsRemito', itemsRemito);
  const columns = React.useMemo(() => [
    {
      Header: 'Pedido',
      accessor: 'id_pedido',
      id: 'id_pedido',
      width: 200,
      Cell: ({ value }) => {
        return (
          <div className={stylesRemito.Pedido} style={{backgroundColor: '#e4e4e5', height: '25px', display: 'flex', alignItems: 'center', position: 'relative'}}>
            <div style={{ padding: '0 10px' }}>{value}</div>
            <div className={stylesRemito.UltimoPedidoResumen}>
              <div className={stylesRemito.header}>
                <div style={{ width: '150px' }}>Producto</div>
                <div style={{ width: '60px' }}>Cant</div>
                <div style={{ width: '60px' }}>Precio</div>
              </div>
              {itemsRemito.filter(i => i.movimiento_enc_id === value).map(i => (
                <div className={stylesRemito.data}>
                  <div style={{ width: '150px' }}>{i.envase_nombre}</div>
                  <div style={{ width: '60px', textAlign: 'center' }}>{i.cantidad}</div>
                  <div style={{ width: '60px', textAlign: 'right' }}>{i.monto / i.cantidad}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    },
    {
      Header: 'Razon Social',
      accessor: 'razon_social',
      id: 'razon_social',
      width: 200,
      Cell: ({ value }) => {
        return (
          <div style={{backgroundColor: '#e4e4e5', height: '25px', display: 'flex', alignItems: 'center'}}>
            <div style={{ padding: '0 10px' }}>{value}</div>
          </div>
        )
      }
    },
    {
      Header: 'Nro Remito',
      accessor: 'nro_remito',
      width: 200,
      Cell: TextEditableCell
    },
  ], [itemsRemito]);

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

  const onGenerarRemitos = () => {
    const remitos = data.map(remito => {
      const nroRemito = remito.nro_remito;
      const sucursal = nroRemito.split('-')[0].padStart(5, '0');
      const comprobante = nroRemito.split('-')[1].padStart(8, '0');

      return {
        //Fecha: moment(remito.fecha).format('YYYY-MM-DD'),
        Fecha: remito.fecha,
        MovimientoEncID: remito.id_pedido,
        NroRemito: `${sucursal}-${comprobante}`,
        Facturado: false,
      }
    })

    onGenerar(remitos);
  }

  return (
    <Modal
      showCancel={true}
      headerText={'Generacion de Remitos'}
      show={show}
      onOk={onGenerarRemitos}
      onCancel={onCancel}
      size='large'
    >
      <Table data={data} columns={columns} updateMyData={updateMyData} />
    </Modal>
  )
}
