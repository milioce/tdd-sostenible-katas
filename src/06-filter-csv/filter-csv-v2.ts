export class FilterCSV {
  constructor(private lines: string[]) {}

  public filter(): string[] {
    const header = this.lines[0];
    const invoices = this.lines.slice(1).map((line) => line.split(','));
    const filteredInvoices = invoices.filter(this.validInvoice.bind(this));

    const lines = filteredInvoices.map(this.convertToCSV);
    return [header, ...lines];
  }

  private validInvoice(invoiceLine: string[]): boolean {
    return this.validIvaAndIgic(invoiceLine) && this.validCifAndNif(invoiceLine);
  }

  private validIvaAndIgic(invoiceLine: string[]): boolean {
    if (String(invoiceLine[4]) !== '' && String(invoiceLine[5]) !== '') {
      return false;
    }

    if (invoiceLine[4] === '' && invoiceLine[5] === '') {
      return false;
    }

    return true;
  }

  private validCifAndNif(invoiceLine: string[]) : boolean {
    if (invoiceLine[7] !== '' && invoiceLine[8] !== '') {
        return false;
    }

    return true;
  }

  private convertToCSV(invoiceLine: string[]): string {
    return invoiceLine.join(',');
  }
}
