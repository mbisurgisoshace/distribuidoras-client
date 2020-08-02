import {
  Hoja as IHoja,
  Movimiento as IMovimiento
} from '../../../types';

export const calculateGastos = (hoja: IHoja) => {
  const gasto_otro = parseFloat(hoja.gasto_otro as any) || 0;
  const gasto_viatico = parseFloat(hoja.gasto_viatico as any) || 0;
  const gasto_combustible = parseFloat(hoja.gasto_combustible as any) || 0;

  return gasto_otro + gasto_viatico + gasto_combustible;
};

export const calculateRendicion = (hoja: IHoja, movimientos: Array<IMovimiento>) => {
  const gastos = calculateGastos(hoja);
  const cobranzas = parseFloat(hoja.cobranza as any) || 0;
  
  return calculateCondicionesPago('contado', movimientos) + cobranzas - gastos;
};

export const calculateCondicionesPago = (condicion: string, movimientos: Array<IMovimiento>) => {
  const entregados = movimientos.filter(m => m.estado_movimiento_id === 3);

  if (condicion === 'contado') {
    return entregados
      .filter(m => m.condicion_venta_id === 1)
      .reduce((acc, curr) => {
        return acc + curr.items.reduce((acc, curr) => acc + curr.monto, 0);
      }, 0);
  }

  if (condicion === 'no contado') {
    return entregados
      .filter(m => m.condicion_venta_id !== 1)
      .reduce((acc, curr) => {
        return acc + curr.items.reduce((acc, curr) => acc + curr.monto, 0);
      }, 0);
  }
};

export const checkHoja = (hoja: IHoja, movimientos: Array<IMovimiento>) => {
  let checkStock = true;
  let checkRendicion = true;

  if (!hoja.control_stock) {
    checkStock = false;
  }

  let checkPedidos = checkPreruteos(movimientos.filter(m => m.tipo_movimiento_id === 1));

  if ((parseFloat(hoja.efectivo as any) + parseFloat(hoja.cheques as any)) !== parseFloat(calculateRendicion(hoja, movimientos).toFixed(2))) {
    checkRendicion = false;
  }

  return {
    checkStock,
    checkPedidos,
    checkRendicion
  }
};

export const checkPreruteos = (preruteos: Array<IMovimiento>): boolean => {
  let check = true;

  preruteos.forEach(m => {
    console.log('m', m);
    if (m.estado_movimiento_id !== 3 && m.motivo_id === null) {
      check = false;
    }
  });
  console.log('check', check);
  return check;
};
