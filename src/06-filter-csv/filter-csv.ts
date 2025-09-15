// Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente
const InvoiceField = {
  ID: 0,
  DATE: 1,
  AMOUNT_GROSS: 2,
  AMOUNT_NET: 3,
  IVA: 4,
  IGIC: 5,
  NOTES: 6,
  CIF: 7,
  NIF: 8,
} as const;

export class FilterCSV {
  private header: string;
  private lines: string[];

  constructor(lines: string[]) {
    this.header = lines[0];
    this.lines = lines.slice(1) || [];
  }

  filter() {
    if (!this.validateHeader()) {
      throw new Error('Error: Invalid header line');
    }

    const invoices = this.getInvoiceData(this.lines);
    const filteredInvoices = invoices.filter((line) => this.validateLine(line));
    const csvLines = this.convertLineToCsv(filteredInvoices);

    return [this.header, ...csvLines];
  }

  private validateLine(invoice: string[]): boolean {
    return (
      this.validateLineIvaIgic(invoice) &&
      this.validateLineCifNif(invoice) &&
      this.validateNetAmount(invoice) &&
      this.validateDuplicateIds(invoice)
    );
  }

  private validateHeader(): boolean {
    if (this.header === undefined) {
      return true;
    }
    
    return typeof this.header === 'string' && this.header.startsWith('Num_factura,');
  }

  private validateLineIvaIgic(invoice: string[]): boolean {
    return this.isEmpty(invoice[InvoiceField.IVA]) || this.isEmpty(invoice[InvoiceField.IGIC]);
  }

  private validateLineCifNif(invoice: string[]): boolean {
    return !this.isEmpty(invoice[InvoiceField.CIF]) !== !this.isEmpty(invoice[InvoiceField.NIF]);
  }

  private validateNetAmount(invoice: string[]): boolean {
    const tax = this.isEmpty(invoice[InvoiceField.IVA]) ? +invoice[InvoiceField.IGIC] : +invoice[InvoiceField.IVA];
    const grossAmount = Number.parseInt(invoice[InvoiceField.AMOUNT_GROSS]);
    const netAmount = Number.parseInt(invoice[InvoiceField.AMOUNT_NET]);

    const calculatedTaxAmount = grossAmount * (tax / 100);
    const calculatedNetAmount = grossAmount - Math.round(calculatedTaxAmount);
    return netAmount === calculatedNetAmount;
  }

  private validateDuplicateIds(invoice: string[]): boolean {
    return this.getCountInvoicesById(invoice[InvoiceField.ID]) === 1;
  }

  private getCountInvoicesById(id: string): number {
    return this.lines.filter((line) => line[InvoiceField.ID] === id).length;
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
