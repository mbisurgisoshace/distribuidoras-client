import * as React from 'react';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import * as classnames from 'classnames';
import { RoutedOuterWrapper as OuterWrapper } from '../../shared/layouts/OuterWrapper';

import Filtros from './Filtros';
import MapView from './MapView';

import * as styles from './styles.css';
import { Canal, Cliente, Zona } from '../../types';
import ZonasService from '../../services/zonas';
import ClientesService from '../../services/clientes';
import { Modal } from '../../shared/components/Modal';
import CanalesService from '../../services/canales';
import { CheckboxList } from '../../shared/components/CheckboxList';
import { Input } from '../../shared/components/Input';
import { DatePicker } from '../../shared/components/DatePicker';
import { RadioSelect } from '../../shared/components/RadioSelect';
import { Button } from '../../shared/components/Button';


interface ReporteMapaState {
  currFilter: any;
  currMenu: string;
  zonas: Array<Zona>;
  canales: Array<Canal>;
  isFiltrosOpen: boolean;
  clientes: Array<Cliente>;
  currTiempo: string;
  currProducto: string;
}

const COLORS = [
  '#1abc9c',
  '#3498db'
];

const NAVEGACION_BUSQUEDA = [
  { value: 'periodo_tiempo', label: 'Periodo de Tiempo' },
  { value: 'zonas', label: 'Zonas' },
  { value: 'canales', label: 'Canales' },
  { value: 'productos', label: 'Productos' }
];

const LEYENDAS = [
  { label: 'Usuario', color: '#2980b9' },
  { label: 'Comercio', color: '#f1c40f' },
  { label: 'Industria', color: '#e74c3c' },
  { label: 'Gran Usuario', color: '#8e44ad' },
  { label: 'Subdistribuidor', color: '#27ae60' },
  { label: 'EESS', color: '#2c3e50' },
  { label: 'Puerta', color: '#7f8c8d' }
];

export default class ReporteMapa extends React.Component<any, ReporteMapaState> {
  constructor(props) {
    super(props);

    this.state = {
      zonas: [],
      canales: [],
      clientes: [],
      currFilter: {},
      currTiempo: '',
      currProducto: '',
      isFiltrosOpen: false,
      currMenu: 'periodo_tiempo'
    };
  }

  async componentDidMount() {
    const zonas = await ZonasService.getZonas();
    const canales = await CanalesService.getCanales();
    this.setState({
      zonas,
      canales
    });
  }

  createGeoJson = (zonas: Array<Zona>) => {
    const geojson = [];

    zonas.filter(z => z.limites).forEach((z, i) => {
      if (z.limites) {
        geojson.push({
          type: 'Feature',
          properties: {
            id: z.zona_id,
            zona: z.zona_nombre,
            color: z.color
          },
          geometry: {
            type: 'Polygon',
            coordinates: JSON.parse(z.limites)
          }
        });
      }
    });
    console.log('geojson', geojson);
    return geojson;
  };

  onSearch = async () => {
    const { currFilter } = this.state;

    if (currFilter.hasOwnProperty('dias')) {
      let dias = parseInt(currFilter.dias);
      let endDate = moment().format('DD-MM-YYYY');
      let startDate = moment().subtract(dias, 'days').format('DD-MM-YYYY');
      currFilter.rango_fechas = {
        end: endDate,
        start: startDate
      };
    }

    const clientes = await ClientesService.searchClientes(currFilter);
    this.setState({
      clientes,
      isFiltrosOpen: false
    });
  };

  onSelectCanales = (selectedCanales: Set<string>) => {
    this.setState({
      currFilter: {
        ...this.state.currFilter,
        canales: Array.from(selectedCanales)
      }
    });
  };

  onSelectZonas = (selectedZonas: Set<string>) => {
    this.setState({
      currFilter: {
        ...this.state.currFilter,
        zonas: Array.from(selectedZonas)
      }
    });
  };

  createTiempoOptions = () => {
    const { currFilter } = this.state;

    return [
      {
        label: 'Periodo en rango de dias anteriores',
        value: 'dias',
        component: (
          <Input
            size={'small'}
            name={'dias'}
            onChange={(e) => {
              this.setState({
                currFilter: {
                  ...currFilter,
                  dias: e.target.value
                }
              });
            }}
            value={currFilter.dias}
            className={styles.BusquedaInput}
          />
        )
      },
      {
        label: 'Rango de fechas',
        value: 'rango_fechas',
        component: (
          <div className={styles.RangoFechas}>
            <DatePicker
              name={'start'}
              size={'small'}
              value={currFilter.rango_fechas?.start || ''}
              onChange={(e) => {
                this.setState({
                  currFilter: {
                    ...currFilter,
                    rango_fechas: {
                      ...currFilter.rango_fechas,
                      start: e.target.value
                    }
                  }
                });
              }}
              className={styles.BusquedaInput}
            />
            <span>hasta</span>
            <DatePicker
              name={'end'}
              size={'small'}
              value={currFilter.rango_fechas?.end || ''}
              onChange={(e) => {
                this.setState({
                  currFilter: {
                    ...currFilter,
                    rango_fechas: {
                      ...currFilter.rango_fechas,
                      end: e.target.value
                    }
                  }
                });
              }}
              className={styles.BusquedaInput}
            />
          </div>
        )
      }
    ];
  };

  createProductoOptions = () => {
    const { currFilter } = this.state;
    console.log('currFilter', currFilter);
    return [
      {
        label: 'Por tipo de producto',
        value: 'tipo_producto',
        component: (
          <div>
            <div className={styles.TipoProductoItem}>
              <span>Butano</span>
              <Input
                size={'small'}
                name={'min'}
                placeholder={'Min'}
                onChange={(e) => {
                  this.setState({
                    currFilter: {
                      ...currFilter,
                      tipo_producto: {
                        ...currFilter.tipo_producto,
                        butano: {
                          ...currFilter.tipo_producto.butano,
                          min: e.target.value
                        }
                      }
                    }
                  });
                }}
                value={currFilter.tipo_producto?.butano?.min || ''}
                className={styles.BusquedaInput}
              />
              <div className={styles.separator} />
              <Input
                size={'small'}
                name={'max'}
                placeholder={'Max'}
                onChange={(e) => {
                  this.setState({
                    currFilter: {
                      ...currFilter,
                      tipo_producto: {
                        ...currFilter.tipo_producto,
                        butano: {
                          ...currFilter.tipo_producto.butano,
                          max: e.target.value
                        }
                      }
                    }
                  });
                }}
                value={currFilter.tipo_producto?.butano?.max || ''}
                className={styles.BusquedaInput}
              />
            </div>
            <div className={styles.TipoProductoItem}>
              <span>Propano</span>
              <Input
                size={'small'}
                name={'min'}
                placeholder={'Min'}
                onChange={(e) => {
                  this.setState({
                    currFilter: {
                      ...currFilter,
                      tipo_producto: {
                        ...currFilter.tipo_producto,
                        propano: {
                          ...currFilter.tipo_producto.propano,
                          min: e.target.value
                        }
                      }
                    }
                  });
                }}
                value={currFilter.tipo_producto?.propano?.min || ''}
                className={styles.BusquedaInput}
              />
              <div className={styles.separator} />
              <Input
                size={'small'}
                name={'max'}
                placeholder={'Max'}
                onChange={(e) => {
                  this.setState({
                    currFilter: {
                      ...currFilter,
                      tipo_producto: {
                        ...currFilter.tipo_producto,
                        propano: {
                          ...currFilter.tipo_producto.propano,
                          max: e.target.value
                        }
                      }
                    }
                  });
                }}
                value={currFilter.tipo_producto?.propano?.max || ''}
                className={styles.BusquedaInput}
              />
            </div>
          </div>
        )
      },
      {
        label: 'Por producto',
        value: 'producto',
        component: (
          <div>

          </div>
        )
      }
    ];
  };

  onChangePreferenciaTiempo = (currFilter: any, option: any) => {
    delete currFilter.dias;
    delete currFilter.rango_fechas;

    if (option === 'dias') {
      this.setState({
        currFilter: {
          ...currFilter,
          [option]: ''
        }
      });
    }

    if (option === 'rango_fechas') {
      this.setState({
        currFilter: {
          ...currFilter,
          [option]: {
            start: '',
            end: ''
          }
        }
      });
    }

    this.setState({
      currTiempo: option
    });
  };

  onChangePreferenciaProducto = (currFilter: any, option: any) => {
    delete currFilter.producto;
    delete currFilter.tipo_producto;

    if (option === 'producto') {
      this.setState({
        currFilter: {
          ...currFilter,
          [option]: {}
        }
      });
    }

    if (option === 'tipo_producto') {
      this.setState({
        currFilter: {
          ...currFilter,
          [option]: {
            butano: {
              min: '',
              max: ''
            },
            propano: {
              min: '',
              max: ''
            }
          }
        }
      });
    }

    this.setState({
      currProducto: option
    });
  };

  exportAsExcelFile = (json, excelFilename) => {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFilename);
  }

  saveAsExcelFile = (buffer, filename) => {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data = new Blob([buffer], { type: EXCEL_TYPE });

    FileSaver.saveAs(data, `${filename}_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }

  render() {
    const { zonas, clientes, canales, currMenu, currFilter, currTiempo, currProducto, isFiltrosOpen } = this.state;

    const canalesOptions = canales.map(c => ({
      label: c.canal_nombre,
      value: c.canal_id.toString()
    }));

    const zonasOptions = zonas.map(z => ({
      label: z.zona_nombre,
      value: z.zona_id.toString()
    }));
    console.log('currFilter', currFilter);
    return (
      <OuterWrapper>
        <div className={styles.ReporteMapa}>
          <div className={styles.Header}>
            <h3>Vista Geografica de Clientes</h3>
            <div style={{display: 'flex'}}>
              <Button
                size={'small'}
                type={'secondary'}
                onClick={() => this.exportAsExcelFile(clientes, 'resultado.xlsx')}
              >
                Exportar
              </Button>
              <div style={{width: 10}} />
              <Button
                size={'small'}
                onClick={() => this.setState({ isFiltrosOpen: true })}
              >
                Busqueda Avanzada
              </Button>
            </div>
          </div>
          {zonas.length > 0 && (
            <MapView
              clientes={clientes}
              zonas={this.createGeoJson(zonas)}
            />
          )}
          <Modal
            size={'large'}
            showCancel={true}
            okText={'Buscar'}
            onOk={this.onSearch}
            show={isFiltrosOpen}
            cancelText={'Cancelar'}
            headerText={'Búsqueda Avanzada'}
            onCancel={() => this.setState({ isFiltrosOpen: false })}
          >
            <div className={styles.BusquedaAvanzada}>
              <div className={styles.Menu}>
                {NAVEGACION_BUSQUEDA.map(menu => (
                  <div
                    key={menu.value}
                    className={classnames(
                      styles.MenuItem,
                      {
                        [styles.isActive]: menu.value === this.state.currMenu
                      }
                    )}
                    onClick={() => this.setState({ currMenu: menu.value })}
                  >
                    {menu.label}
                  </div>
                ))}
              </div>
              <div className={styles.Contenido}>
                {currMenu === 'periodo_tiempo' && (
                  <div className={styles.Item}>
                    <h3>Periodo de Tiempo</h3>
                    <RadioSelect
                      value={currTiempo}
                      options={this.createTiempoOptions()}
                      onChange={(option) => this.onChangePreferenciaTiempo(currFilter, option)}
                    />
                  </div>
                )}
                {currMenu === 'zonas' && (
                  <div className={styles.Item}>
                    <h3>Zonas</h3>
                    <CheckboxList
                      options={zonasOptions}
                      selectedOptions={new Set(currFilter.zonas ? currFilter.zonas : [])}
                      onChange={this.onSelectZonas}
                    />
                  </div>
                )}
                {currMenu === 'canales' && (
                  <div className={styles.Item}>
                    <h3>Canales</h3>
                    <CheckboxList
                      options={canalesOptions}
                      selectedOptions={new Set(currFilter.canales ? currFilter.canales : [])}
                      onChange={this.onSelectCanales}
                    />
                  </div>
                )}
                {currMenu === 'productos' && (
                  <div className={styles.Item}>
                    <h3>Productos</h3>
                    <RadioSelect
                      value={currProducto}
                      options={this.createProductoOptions()}
                      onChange={(option) => this.onChangePreferenciaProducto(currFilter, option)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Modal>
          <div className={styles.Leyenda}>
            {LEYENDAS.map(l => (
              <div key={l.label} className={styles.LeyendaItem}>
                <div className={styles.marca} style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </OuterWrapper>
    );
  }
}
