// Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
const InvoiceField = {
  NUM: 0,
  DATE: 1,
  BRUTO: 2,
  NETO: 3,
  IVA: 4,
  IGIC: 5,
  NOTES: 6,
  CIF: 7,
  NIF: 8,
} as const;

export class FilterCSV {
  constructor(private lines: string[]) {}

  filter() {
    const header = this.lines[0];
    const lines = this.lines.slice(1) || [];

    const invoices = this.getInvoiceData(lines);
    const filteredInvoices = invoices.filter((line) => this.validateLine(line));
    const csvLines = this.convertLineToCsv(filteredInvoices);

    return [header, ...csvLines];
  }

  private validateLine(invoice: string[]) {
    return this.validateLineIvaIgic(invoice) && this.validateLineCifNif(invoice) && this.validateNetAmount(invoice);
  }

  private validateLineIvaIgic(invoice: string[]) {
    return this.isEmpty(invoice[InvoiceField.IVA]) || this.isEmpty(invoice[InvoiceField.IGIC]);
  }

  private validateLineCifNif(invoice: string[]) {
    return !this.isEmpty(invoice[InvoiceField.CIF]) !== !this.isEmpty(invoice[InvoiceField.NIF]);
  }

  private validateNetAmount(invoice: string[]) {
    const tax = this.isEmpty(invoice[InvoiceField.IVA]) ? +invoice[InvoiceField.IGIC] : +invoice[InvoiceField.IVA];
    const grossAmount = Number.parseInt(invoice[InvoiceField.BRUTO]);
    const netAmount = Number.parseInt(invoice[InvoiceField.NETO]);

    const calculatedTaxAmount = grossAmount * (tax / 100);
    const calculatedNetAmount = grossAmount - Math.round(calculatedTaxAmount);
    return netAmount === calculatedNetAmount;
  }

  private getInvoiceData(lines: string[]) {
    return lines.map((line) => line.split(','));
  }

  private convertLineToCsv(filteredInvoices: string[][]) {
    return filteredInvoices.map((line) => line.join(','));
  }

  private isEmpty(text: string) {
    return String(text).trim() === '';
  }
}
