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
    if (invoiceLine.iva !== '' && invoiceLine.igic !== '') {
      return false;
    }

    if (invoiceLine.iva === '' && invoiceLine.igic === '') {
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
    const grossAmount = parseInt(invoiceLine.grossAmount);
    const netAmount = parseInt(invoiceLine.netAmount);
    const tax = invoiceLine.iva ? parseInt(invoiceLine.iva) : parseInt(invoiceLine.igic);

    const calculatedTaxAmount = grossAmount * (tax / 100);
    const calculatedNetAmount = grossAmount - Math.round(calculatedTaxAmount);

    return netAmount === calculatedNetAmount;
  }
}
