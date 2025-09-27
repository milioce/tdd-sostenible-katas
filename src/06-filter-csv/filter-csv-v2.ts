export class FilterCSV {
    constructor(private lines: string[]) {}

    public filter(): string[] {
        const header = this.lines[0];
        const invoices = this.lines.slice(1).map(line => line.split(','));
        const filteredInvoices = invoices.filter(line => !(String(line[4]) !== '' && String(line[5]) !== ''));
        const lines = filteredInvoices.map(line => line.join(','));
        return [header, ...lines];
    }
}