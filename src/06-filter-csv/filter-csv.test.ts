/**
 * Enunciado:
 * ----------
 * Filtrar los datos de un fichero en formato CSV y genera otro fichero CSV
 * No vamos a considerar leer y generar fichero, trabajamos solo con el texto.
 *
 * Es un fichero con información de facturas. La primera línea tiene los nombres de campos, el resto cada línea es una factura.
 *
 * Ejemplo de fichero
 * ------------------
 * Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
 * 1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,
 * 2,03/08/2019,2000,2000,,8,MacBook Pro,,78544372A
 * 3,03/12/2019,1000,2000,19,8, LenovoLaptop,,78544372A
 *
 * Reglas de negocio
 * -----------------
 *
 * Es válido que algunos campos estén vacíos, apareciendo dos comas seguidas o una coma final.
 * El número de factura no puede estar repetido, si lo estuviese eliminaremos todas las líneas con repetición.
 * Los impuestos IVA e IGIC son excluyentes, es decir, sólo puede aplicarse uno de los dos. Si alguna línea tiene contenido en ambos campos debe quedarse fuera.
 * Los campos CIF y NIF son excluyentes, sólo se puede usar uno de ellos.
 * El neto es el resultado de aplicar al bruto el correspondiente impuesto. Si algún neto no está bien calculado la línea se queda fuera.
 *
 * Como programadores debemos explorar los casos extraños o anómalos y cual debería ser la respuesta del sistema ante ellos.
 * Ante la duda se debe trasladar a los expertos de negocio
 *
 * Listado de pruebas
 * ------------------
 * - Un fichero con una sola factura donde todo es correcto, debería producir como salida la misma línea
 * - Un fichero con una sola factura donde IVA y IGIC están rellenos, debe eliminarse de la salida
 *   + Asumo que pueden venir los dos en blanco, sin impuestos
 * - Un fichero con una sola factura donde CIF y NIF están rellenos, debe eliminarse de la salida
 *   + Asumo que Cuno al menos es obligatorio
 * - Un fichero con una sola factura donde el neto no está bien calculado, debe eliminarse de la salida
 * - Un fichero con una sola factura y algun campo opcional vacío, debe generar la misma linea como salida
 * - Un fichero con varias facturas que tienen el mismo número de factura, debe eliminarse todas ellas de la salida
 * - Una lista vacía producirá una lista vacía de salida
 * - Un fichero de una sola línea sin cabecera es incorrecto
 */

import { FilterCSV } from './filter-csv';

describe('CSV Filter', () => {
  let headerLine: string;

  beforeEach(() => {
    headerLine = 'Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente';
  });

  it('When the file has 1 correct invoice line, when the output is the same line', () => {
    const invoiceLine = createInvoiceLine({});
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine, invoiceLine]);
  });

  it('When the file has an invoice line with IVA and IGIC, the line is removed', () => {
    const invoiceLine = createInvoiceLine({ ivaTax: '21', igicTax: '7' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when an invoice line with CIF and NIF are filled, then the line is removed', () => {
    const invoiceLine = createInvoiceLine({ cif: 'B76430134', nif: '18742978W' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when an invoice line with CIF and NIF are empty, then the line is removed', () => {
    const invoiceLine = createInvoiceLine({ cif: '', nif: '' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when an invoice line has the netAmount incorrectly calculated for IVA tax, then the line is removed', () => {
    const invoiceLine = createInvoiceLine({ grossAmount: '1000', netAmount: '700', ivaTax: '21' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when an invoice line has the netAmount incorrectly calculated for IGIC tax, then the line is removed', () => {
    const invoiceLine = createInvoiceLine({ grossAmount: '1000', netAmount: '790', igicTax: '7' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when there are multiple invoice lines with the same ID, then are all removed', () => {
    const invoiceLine1 = createInvoiceLine({ id: '1' });
    const invoiceLine2 = createInvoiceLine({ id: '1' });
    const invoiceLine3 = createInvoiceLine({ id: '1' });
    const cvsFilter = new FilterCSV([headerLine, invoiceLine1, invoiceLine2, invoiceLine3]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('when there are empty invoice lines, then they is a empty output', () => {
    const cvsFilter = new FilterCSV([]);

    const result = cvsFilter.filter();

    expect(result).toEqual([]);
  });
});

// Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
function createInvoiceLine({
  id = '1',
  date = '15/09/2025',
  grossAmount = '1000',
  netAmount = '790',
  ivaTax = '21',
  igicTax = '',
  concept = 'Test product',
  nif = '18742978W',
  cif = '',
}) {
  return [id, date, grossAmount, netAmount, ivaTax, igicTax, concept, nif, cif].join(',');
}
