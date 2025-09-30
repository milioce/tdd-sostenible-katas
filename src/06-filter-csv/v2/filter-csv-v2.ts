import { InvoiceLine } from './invoice-line';

export class FilterCSV {
  constructor(private lines: string[]) {}

  public filter(): string[] {
    if (this.lines.length === 1) {
      throw new Error('Invalid CSV lines');
    }

    const header = this.lines[0];
    const invoices = this.lines.slice(1).map((line) => InvoiceLine.fromCSV(line));
    const filteredInvoices = invoices.filter(this.validInvoiceFilter.bind(this));
    const lines = filteredInvoices.map((invoice) => invoice.toCSV());
    return [header, ...lines];
  }

  private validInvoiceFilter(invoiceLine: InvoiceLine, index: number, array: InvoiceLine[]): boolean {
    return (
      this.validIvaAndIgic(invoiceLine) &&
      this.validCifAndNif(invoiceLine) &&
      this.validCalculatedNetAmount(invoiceLine) &&
      this.validNonDuplicatedId(invoiceLine, array)
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

  private validNonDuplicatedId(invoiceLine: InvoiceLine, allInvoices: InvoiceLine[]): boolean {
    const invoicesWithSameId = allInvoices.filter((line) => line.id === invoiceLine.id);
    return invoicesWithSameId.length === 1;
  }
}
