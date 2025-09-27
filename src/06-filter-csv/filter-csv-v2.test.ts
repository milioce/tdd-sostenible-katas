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
 * Num_factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
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
 * - Un fichero con una sola factura donde IVA y IGIC están vacíos, debe eliminarse de la salida
 * - Un fichero con una sola factura donde CIF y NIF están rellenos, debe eliminarse de la salida
 * - Un fichero con una sola factura donde CIF y NIF están vacíos, debe eliminarse de la salida
 * - Un fichero con una sola factura con IVA donde el neto no está bien calculado, debe eliminarse de la salida
 * - Un fichero con una sola factura con IGIC donde el neto no está bien calculado, debe eliminarse de la salida
 * - Un fichero con varias facturas correctas, debe generar la misma salida
 * - Un fichero con varias facturas con IDs repetidos, debe eliminarse todas las líneas con ID duplicado
 * - Una lista vacía producirá una lista vacía de salida
 * - Un fichero de una sola línea, devuelve una excepción
 */

import { FilterCSV } from './filter-csv-v2';

describe('CSV Filter', () => {
  const headerLine = 'Num_factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente';

  it('When the file has 1 correct invoice line, when the output is the same line', () => {
    const invoiceLine = createInvoiceLine({iva: '21', igic: ''});
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine, invoiceLine]);
  });

  it('When the file with one line has both IVA and IGIC filled, the invoice is removed', () => {
    const invoiceLine = createInvoiceLine({iva: '21', igic: '7'});
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });

  it('When the file with one line has both IVA and IGIC empty, the invoice is removed', () => {
    const invoiceLine = createInvoiceLine({iva: '', igic: ''});
    const cvsFilter = new FilterCSV([headerLine, invoiceLine]);

    const result = cvsFilter.filter();

    expect(result).toEqual([headerLine]);
  });
});

function createInvoiceLine({iva = '21', igic = '', grossAmount = '1000', netAmount = '790', cif = 'B76430134', nif = ''}): string {
  const id = '1';
  const date = '02/05/2019';
  const concept = 'ACERLaptop';

  return [id, date, grossAmount, netAmount, iva, igic, concept, cif, nif].join(',');
}