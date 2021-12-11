import { MovimientoStockItem } from '../../../types';
import { TipoMovimiento } from '../../../types/Stock';

export const generarItems = (tipo:TipoMovimiento, items: MovimientoStockItem[]) => {
  switch (tipo) {
    case 'Compra Producto':
      return generarItemsCompraProducto(items);
    case 'Reposicion Averia':
      return generarItemsReposicionAveria(items);
    case 'Devolucion Averia':
      return generarItemsDevolucionAveria(items);
    case 'Venta Envase':
      return generarItemsVentaEnvase(items);
    case 'Compra Envase':
      return generarItemsCompraEnvase(items);
    case 'Donaciones':
      return generarItemsDonaciones(items);
    case 'Saldo Inicial':
      return generarItemsSaldoInicial(items);
  }
}

const generarItemsCompraProducto = (items: MovimientoStockItem[]) => {
  const stockItems = [];
  items.forEach(item => {
    const lleno: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 1,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    }
    const vacio: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 2,
      cantidad: item.cantidad * -1,
      comodato_generado: false,
      costo: item.costo
    }

    stockItems.push(lleno, vacio);
  })
  return stockItems;
}

const generarItemsSaldoInicial = (items: MovimientoStockItem[]) => {
  const stockItems: MovimientoStockItem[] = [];
  items.forEach(item => {
    stockItems.push({
      envase_id: item.envase_id,
      estado_envase_id: 1,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    })
  })
  return stockItems;
}

const generarItemsVentaEnvase = (items: MovimientoStockItem[]) => {
  const stockItems: MovimientoStockItem[] = [];
  items.forEach(item => {
    stockItems.push({
      envase_id: item.envase_id,
      estado_envase_id: 2,
      cantidad: item.cantidad * -1,
      comodato_generado: false,
      costo: item.costo
    })
  })
  return stockItems;
}

const generarItemsCompraEnvase = (items: MovimientoStockItem[]) => {
  const stockItems: MovimientoStockItem[] = [];
  items.forEach(item => {
    stockItems.push({
      envase_id: item.envase_id,
      estado_envase_id: 2,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    })
  })
  return stockItems;
}

const generarItemsReposicionAveria = (items: MovimientoStockItem[]) => {
  const stockItems = [];
  items.forEach(item => {
    const lleno: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 1,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    }
    const averiado: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 3,
      cantidad: item.cantidad * -1,
      comodato_generado: false,
      costo: item.costo
    }

    stockItems.push(lleno, averiado);
  })
  return stockItems;
}

const generarItemsDevolucionAveria = (items: MovimientoStockItem[]) => {
  const stockItems = [];
  items.forEach(item => {
    const vacio: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 2,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    }
    const averiado: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 3,
      cantidad: item.cantidad * -1,
      comodato_generado: false,
      costo: item.costo
    }

    stockItems.push(vacio, averiado);
  })
  return stockItems;
}

const generarItemsDonaciones = (items: MovimientoStockItem[]) => {
  const stockItems = [];
  items.forEach(item => {
    const lleno: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 1,
      cantidad: item.cantidad * -1,
      comodato_generado: false,
      costo: item.costo
    }
    const vacio: MovimientoStockItem = {
      envase_id: item.envase_id,
      estado_envase_id: 2,
      cantidad: item.cantidad,
      comodato_generado: false,
      costo: item.costo
    }

    stockItems.push(lleno, vacio);
  })
  return stockItems;
}
