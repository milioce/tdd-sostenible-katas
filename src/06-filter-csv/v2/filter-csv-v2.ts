import { InvoiceLine } from './invoice-line';

export class FilterCSV {
  constructor(private lines: string[]) {}

  public filter(): string[] {
    const header = this.lines[0];
    const invoices = this.lines.slice(1).map((line) => InvoiceLine.fromCSV(line));
    const filteredInvoices = invoices.filter(this.validInvoiceLine.bind(this));
    const lines = filteredInvoices.map((invoice) => invoice.toCSV());
    return [header, ...lines];
  }

  private validInvoiceLine(invoiceLine: InvoiceLine): boolean {
    return (
      this.validIvaAndIgic(invoiceLine) &&
      this.validCifAndNif(invoiceLine) &&
      this.validCalculatedNetAmount(invoiceLine)
    );
  }

  private validIvaAndIgic(invoiceLine: InvoiceLine): boolean {
    if (invoiceLine.iva !== 0 && invoiceLine.igic !== 0) {
      return false;
    }

    if (invoiceLine.iva === 0 && invoiceLine.igic === 0) {
      return false;
    }

    return true;
  }

  private validCifAndNif(invoiceLine: InvoiceLine): boolean {
    if (invoiceLine.cif !== '' && invoiceLine.nif !== '') {
      return false;
    }

    if (invoiceLine.cif === '' && invoiceLine.nif === '') {
      return false;
    }

    return true;
  }

  private validCalculatedNetAmount(invoiceLine: InvoiceLine): boolean {
    const tax = invoiceLine.iva ? invoiceLine.iva : invoiceLine.igic;

    const calculatedTaxAmount = invoiceLine.grossAmount * (tax / 100);
    const calculatedNetAmount = invoiceLine.grossAmount - Math.round(calculatedTaxAmount);

    return invoiceLine.netAmount === calculatedNetAmount;
  }
}
