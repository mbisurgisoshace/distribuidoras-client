import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './styles.css';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { enhanceWithHeader } from '../HeaderNavBar';
import { Home } from '../../../Home';
import { Login } from '../../../Login';
import { Logout } from '../../../Logout';
import { Reportes } from '../../../Reportes';
import { Hoja } from '../../../Hojas/components/Hoja';
import { AllHojas } from '../../../Hojas/components/AllHojas';
import { Cliente } from '../../../Clientes/components/Cliente';
import { NewPedido } from '../../../Pedidos/components/NewPedido';
import { Comercio } from '../../../Comercios/components/Comercio';
import { NewRetiro } from '../../../Comodatos/components/NewRetiro';
import { DefinirZona } from '../../../Zonas/components/DefinirZona';
import { NewCliente } from '../../../Clientes/components/NewCliente';
import { ControlStock } from '../../../Stock/components/ControlStock';
import { AllClientes } from '../../../Clientes/components/AllClientes';
import { NewComercio } from '../../../Comercios/components/NewComercio';
import { NewComodato } from '../../../Comodatos/components/NewComodato';
import { AllComercios } from '../../../Comercios/components/AllComercios';
import { ComercioStock } from '../../../Comercios/components/ComercioStock';
import { MonitorEntregas } from '../../../Comercios/components/MonitorEntregas';
import { TareaComodato } from '../../../Comodatos/components/TareaComodato';
import { NewPerdida } from '../../../Comodatos/components/NewPerdida';
import { RenovacionComodato } from '../../../Comodatos/components/RenovacionComodato';
import { Monitor } from '../../../Pedidos/components/Monitor';
import { Limites } from '../../../Zonas/components/Limites';
import ReporteMapa from '../../../Reportes/Mapa';
import { Pedido } from '../../../Pedidos/components/Pedido';
import { NewHoja } from '../../../Hojas/components/NewHoja';
import { AllPrecios } from '../../../Precios/components/AllPrecios';
import { AllFeriados } from '../../../Feriados/components/AllFeriados';
import { StockForm } from '../../../Stock/components/StockForm';
import { NewObjetivo } from '../../../Objetivos/components/NewObjetivo';

const AuthenticatedRoutes = enhanceWithHeader(() => (
  <React.Fragment>
    <AuthenticatedRoute path='/' exact component={Home} />
    <AuthenticatedRoute path='/tablas/general' exact component={Home} />
    <AuthenticatedRoute path='/tablas/zonas' exact component={Limites} />
    <AuthenticatedRoute path='/hojas' exact component={AllHojas} />
    <AuthenticatedRoute path='/hojas/new' exact component={NewHoja} />
    <AuthenticatedRoute path='/hojas/:hojaId(\d+)' exact component={Hoja} />
    <AuthenticatedRoute path='/clientes' exact component={AllClientes} />
    <AuthenticatedRoute path='/clientes/new' exact component={NewCliente} />
    <AuthenticatedRoute path='/clientes/:clienteId(\d+)' exact component={Cliente} />
    <AuthenticatedRoute path='/comercios' exact component={AllComercios} />
    <AuthenticatedRoute path='/comercios/new' exact component={NewComercio} />
    <AuthenticatedRoute path='/comercios/entregas' exact component={MonitorEntregas} />
    <AuthenticatedRoute path='/comercios/stock/new' exact component={ComercioStock} />
    <AuthenticatedRoute path='/comercios/:comercioId(\d+)' exact component={Comercio} />
    <AuthenticatedRoute path='/pedidos' exact component={Monitor} />
    <AuthenticatedRoute path='/pedidos/new' exact component={NewPedido} />
    <AuthenticatedRoute path='/pedidos/:pedidoId(\d+)' exact component={Pedido} />
    <AuthenticatedRoute path='/comodatos/new' exact component={NewComodato} />
    <AuthenticatedRoute path='/comodatos/retiro' exact component={NewRetiro} />
    <AuthenticatedRoute path='/comodatos/perdida' exact component={NewPerdida} />
    <AuthenticatedRoute path='/comodatos/gestion' exact component={TareaComodato} />
    <AuthenticatedRoute path='/comodatos/renovacion' exact component={RenovacionComodato} />
    <AuthenticatedRoute path='/stock' exact component={AllClientes} />
    <AuthenticatedRoute path='/stock/cierre' exact component={ControlStock} />
    <AuthenticatedRoute path='/stock/control' exact component={ControlStock} />
    <AuthenticatedRoute path='/reportes' exact component={Reportes} />
    <AuthenticatedRoute path='/reportes/mapa' exact component={ReporteMapa} />
    <AuthenticatedRoute path='/precios' exact component={AllPrecios} />
    <AuthenticatedRoute path='/feriados' exact component={AllFeriados} />
    <AuthenticatedRoute path='/stock/compra-producto' exact component={() => <StockForm tipoMovimiento={'Compra Producto'} />} />
    <AuthenticatedRoute path='/stock/venta-envase' exact component={() => <StockForm tipoMovimiento={'Venta Envase'} />} />
    <AuthenticatedRoute path='/stock/compra-envase' exact component={() => <StockForm tipoMovimiento={'Compra Envase'} />} />
    <AuthenticatedRoute path='/stock/donacion' exact component={() => <StockForm tipoMovimiento={'Donaciones'} />} />
    <AuthenticatedRoute path='/stock/saldo-inicial' exact component={() => <StockForm tipoMovimiento={'Reposicion Averia'} />} />
    <AuthenticatedRoute path='/stock/reposicion-averia' exact component={() => <StockForm tipoMovimiento={'Reposicion Averia'} />} />
    <AuthenticatedRoute path='/stock/devolucion-averia' exact component={() => <StockForm tipoMovimiento={'Devolucion Averia'} />} />
      <AuthenticatedRoute path='/objetivos/new' exact component={NewObjetivo} />
  </React.Fragment>
));

export const Shell = (): React.ReactElement<any> => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/logout' exact component={Logout} />
        <AuthenticatedRoutes />
      </Switch>
    </BrowserRouter>
  );
};
