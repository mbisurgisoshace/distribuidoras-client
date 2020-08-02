import { Carga, Envase, Hoja, Movimiento, MovimientoStock, MovimientoStockItem } from '../../../types';

export const checkStock = (articulos: Array<string>, envases: Array<Envase>, cargas: Array<Carga>, movimientos: Array<Movimiento>): boolean => {
  const filterCargas = [];
  cargas.forEach(c => {
    filterCargas.push({
      ...c,
      items: c.items.filter(i => articulos.includes(i.envase_id.toString()))
    });
  });

  const filterMovimientos = [];
  movimientos.forEach(m => {
    filterMovimientos.push({
      ...m,
      items: m.items.filter(i => articulos.includes(i.envase_id.toString()))
    });
  });

  const ci = filterCargas.find(c => c.carga_tipo_id === 1);
  const rp = filterCargas.find(c => c.carga_tipo_id === 2);
  const re1 = filterCargas.find(c => c.carga_tipo_id === 3);
  const re2 = filterCargas.find(c => c.carga_tipo_id === 4);

  const controlLleno = calculateControlLleno(re1, re2);
  const remanenteLleno = calculateRemanenteLleno(ci, rp, re1, re2, filterMovimientos, envases);
  const controlVacio = calculateControlVacio(re1, re2, filterMovimientos, envases);
  const remanenteVacio = calculateRemanenteVacio(rp, re1, re2, filterMovimientos, envases);

  return controlLleno - remanenteLleno === 0 && controlVacio - remanenteVacio === 0;
};

export const generarStockEnc = (hoja: Hoja): MovimientoStock => {
  return {
    hoja_ruta_id: hoja.hoja_ruta_id,
    fecha: hoja.fecha,
    tipo_movimiento: 'Venta Diaria',
    modulo: 'Venta'
  }
};

export const generarStockDet = (articulos: Array<string>, envases: Array<Envase>, cargas: Array<Carga>, movimientos: Array<Movimiento>, envaseId: number, encId: number): Array<MovimientoStockItem> => {
  const filterCargas = [];
  cargas.forEach(c => {
    filterCargas.push({
      ...c,
      items: c.items.filter(i => articulos.includes(i.envase_id.toString()))
    });
  });

  const filterMovimientos = [];
  movimientos.forEach(m => {
    if (m.estado_movimiento_id === 3) {
      filterMovimientos.push({
        ...m,
        items: m.items.filter(i => articulos.includes(i.envase_id.toString()))
      });
    }
  });

  const re1 = filterCargas.find(c => c.carga_tipo_id === 3);
  const re2 = filterCargas.find(c => c.carga_tipo_id === 4);

  let lleno = calcularLleno(re1, re2, filterMovimientos, envases);
  let vacio = calcularVacio(re1, re2, filterMovimientos, envases);
  let averia = calcularAveria(re1, re2);
  let comodato = calcularComodato(re1, re2);

  return [
    { movimiento_stock_enc_id: encId, envase_id: envaseId, estado_envase_id: 1, cantidad: lleno, comodato_generado: false },
    { movimiento_stock_enc_id: encId, envase_id: envaseId, estado_envase_id: 2, cantidad: vacio, comodato_generado: false },
    { movimiento_stock_enc_id: encId, envase_id: envaseId, estado_envase_id: 3, cantidad: averia, comodato_generado: false },
    { movimiento_stock_enc_id: encId, envase_id: envaseId, estado_envase_id: 4, cantidad: comodato, comodato_generado: false }
  ];
};

const calcularLleno = (re1: Carga, re2: Carga, movs: Array<Movimiento>, envases: Array<Envase>) => {
  const vtaResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && (envase.tipo_envase_id === 1 || envase.tipo_envase_id === 2)) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);

  const re1Result = re1 ? re1.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  const re2Result = re2 ? re2.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  return -vtaResult - re1Result - re2Result;
};

const calcularVacio = (re1: Carga, re2: Carga, movs: Array<Movimiento>, envases: Array<Envase>) => {
  const vtaResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && (envase.tipo_envase_id === 1 || envase.tipo_envase_id === 2)) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);
  const reCambioResult = (re1 ? re1.items.reduce((acc, curr) => {
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase &&  envase.tipo_envase_id === 1 && envase.kilos === 15) {
      return acc - curr.cambio;
    }

    return acc + curr.cambio;
  }, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => {
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase &&  envase.tipo_envase_id === 1 && envase.kilos === 15) {
      return acc - curr.cambio;
    }

    return acc + curr.cambio;
  }, 0) : 0);
  const reRetiroResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0);
  const reEntregaResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0);
  const vtaEnvResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && envase.tipo_envase_id === 4) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);
  return vtaResult + reRetiroResult - reEntregaResult - reCambioResult - vtaEnvResult;
};

const calcularAveria = (re1: Carga, re2: Carga) => {
  const re1Result = re1 ? re1.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  const re2Result = re2 ? re2.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  return re1Result + re2Result;
};

const calcularComodato = (re1: Carga, re2: Carga) => {
  const reRetiroResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0);
  const reEntregaResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0);
  return reRetiroResult - reEntregaResult;
};

const calculateControlLleno = (re1: Carga, re2: Carga) => {
  return (re1 ? re1.items.reduce((acc, curr) => acc + curr.lleno, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.lleno, 0) : 0);
};

const calculateControlVacio = (re1: Carga, re2: Carga, movs: Array<Movimiento>, envases: Array<Envase>) => {
  const reVacioResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.vacio, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.vacio, 0) : 0);
  const reCambioResult = (re1 ? re1.items.reduce((acc, curr) => {
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase &&  envase.tipo_envase_id === 1 && envase.kilos === 15) {
      return acc - curr.cambio;
    }

    return acc + curr.cambio;
  }, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => {
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase &&  envase.tipo_envase_id === 1 && envase.kilos === 15) {
      return acc - curr.cambio;
    }

    return acc + curr.cambio;
  }, 0) : 0);
  const reRetiroResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.retiro, 0) : 0);
  const reEntregaResult = (re1 ? re1.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0) + (re2 ? re2.items.reduce((acc, curr) => acc + curr.entrega, 0) : 0);
  const vtaEnvResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && envase.tipo_envase_id === 4) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);

  return reVacioResult - reRetiroResult + reEntregaResult + reCambioResult + vtaEnvResult;
};

const calculateRemanenteLleno = (ci: Carga, rp: Carga, re1: Carga, re2: Carga, movs: Array<Movimiento>, envases: Array<Envase>) => {
  const ciResult = ci ? ci.items.reduce((acc, curr) => acc + curr.lleno, 0) : 0;
  const rpResult = rp ? rp.items.reduce((acc, curr) => acc + curr.lleno, 0) : 0;
  const re1Result = re1 ? re1.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  const re2Result = re2 ? re2.items.reduce((acc, curr) => acc + curr.averiado, 0) : 0;
  const vtaResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && (envase.tipo_envase_id === 1 || envase.tipo_envase_id === 2)) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);

  return ciResult + rpResult - vtaResult - (re1Result + re2Result);
};

const calculateRemanenteVacio = (rp: Carga, re1: Carga, re2: Carga, movs: Array<Movimiento>, envases: Array<Envase>) => {
  const rpResult = rp ? rp.items.reduce((acc, curr) => acc + curr.vacio, 0) : 0;
  const vtaResult = movs.map(m => m.items.reduce((acc, curr) => {
    let cantidad = 0;
    const envase = envases.find(e => e.envase_id === curr.envase_id);

    if (envase && (envase.tipo_envase_id === 1 || envase.tipo_envase_id === 2)) {
      cantidad = curr.cantidad;
    }

    return acc + cantidad;
  }, 0)).reduce((acc, curr) => acc + curr, 0);

  return rpResult + vtaResult;
};
