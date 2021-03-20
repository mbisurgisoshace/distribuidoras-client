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

const AuthenticatedRoutes = enhanceWithHeader(() => (
  <React.Fragment>
    <AuthenticatedRoute path="/" exact component={Home}/>
    <AuthenticatedRoute path="/tablas/general" exact component={Home}/>
    <AuthenticatedRoute path="/tablas/zonas" exact component={DefinirZona}/>
    <AuthenticatedRoute path="/hojas" exact component={AllHojas}/>
    <AuthenticatedRoute path="/hojas/:hojaId(\d+)" exact component={Hoja}/>
    <AuthenticatedRoute path="/clientes" exact component={AllClientes}/>
    <AuthenticatedRoute path="/clientes/new" exact component={NewCliente}/>
    <AuthenticatedRoute path="/clientes/:clienteId(\d+)" exact component={Cliente}/>
    <AuthenticatedRoute path="/comercios" exact component={AllComercios}/>
    <AuthenticatedRoute path="/comercios/new" exact component={NewComercio}/>
    <AuthenticatedRoute path="/comercios/entregas" exact component={MonitorEntregas}/>
    <AuthenticatedRoute path="/comercios/stock/new" exact component={ComercioStock}/>
    <AuthenticatedRoute path="/comercios/:comercioId(\d+)" exact component={Comercio}/>
    <AuthenticatedRoute path="/pedidos/new" exact component={NewPedido}/>
    <AuthenticatedRoute path="/comodatos/new" exact component={NewComodato}/>
    <AuthenticatedRoute path="/comodatos/retiro" exact component={NewRetiro}/>
    <AuthenticatedRoute path="/comodatos/gestion" exact component={TareaComodato}/>
    <AuthenticatedRoute path="/stock" exact component={AllClientes}/>
    <AuthenticatedRoute path="/stock/cierre" exact component={ControlStock}/>
    <AuthenticatedRoute path="/stock/control" exact component={ControlStock}/>
    <AuthenticatedRoute path="/reportes" exact component={Reportes}/>
  </React.Fragment>
));

export const Shell = (): React.ReactElement<any> => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login}/>
        <Route path="/logout" exact component={Logout}/>
        <AuthenticatedRoutes/>
      </Switch>
    </BrowserRouter>
  );
};
