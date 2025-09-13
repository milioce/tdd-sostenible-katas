export class FilterCSV {
  constructor(private lines: string[]) {}

  filter() {
    const header = this.lines[0];
    const lines = this.lines.slice(1) || [];

    const invoices = this.getInvoiceData(lines);
    const filteredInvoices = this.filterFilledIvaAndIgic(invoices);

    const csvLines = this.convertLineToCsv(filteredInvoices);

    return [header, ...csvLines];
  }


  private convertLineToCsv(filteredInvoices: string[][]) {
    return filteredInvoices.map((line) => line.join(','));
  }

  private filterFilledIvaAndIgic(invoices: string[][]) {
    return invoices.filter((line) => line[4] === '' || line[5] === '');
  }

  private getInvoiceData(lines: string[]) {
    return lines.map((line) => line.split(','));
  }
}
