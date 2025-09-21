export class FilterCSV {
    constructor(private lines: string[]) {}

    public filter(): string[] {
        return this.lines;
    }
}