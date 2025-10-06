class ColumnWidth {
  private constructor(private readonly width: number) {}

  static create(width: number) {
    if (width < 0) {
      throw new Error('Negative column width is not allowed');
    }
    return new ColumnWidth(width);
  }

  value() {
    return this.width;
  }
}

class WrappableText {
  private constructor(private readonly text: string) {}

  static create(text: string) {
    if (text == null) {
      return new WrappableText('');
    }

    return new WrappableText(text);
  }

  wordWrap(columnWidth: ColumnWidth) {
    if (this.fitsIn(columnWidth)) {
      return WrappableText.create(this.value());
    }

    const wrappedText = this.wrappedText(columnWidth);
    const unwrappedText = this.unwrappedText(columnWidth);

    return wrappedText.concat(unwrappedText.wordWrap(columnWidth));
  }

  private fitsIn(columnWidth: ColumnWidth): boolean {
    return this.value().length <= columnWidth.value();
  }

  private concat(text: WrappableText): WrappableText {
    return WrappableText.create(this.value().concat(text.value()));
  }

  private wrappedText(columnWidth: ColumnWidth): WrappableText {
    return WrappableText.create(this.value().substring(0, this.wrapIndex(columnWidth)).concat('\n'));
  }

  private wrapIndex(columnWidth: ColumnWidth): number {
    return this.shallWrapBySpace(columnWidth) ? this.indexOfSpace() : columnWidth.value();
  }

  private unwrappedText(columnWidth: ColumnWidth): WrappableText {
    return WrappableText.create(this.value().substring(this.unwrapIndex(columnWidth)));
  }

  private unwrapIndex(columnWidth: ColumnWidth): number {
    return this.shallWrapBySpace(columnWidth) ? this.indexOfSpace() + 1 : columnWidth.value();
  }

  private shallWrapBySpace(columnWidth: ColumnWidth): boolean {
    return this.indexOfSpace() > -1 && this.indexOfSpace() < columnWidth.value();
  }

  private indexOfSpace(): number {
    return this.value().indexOf(' ');
  }

  value(): string {
    return this.text;
  }
}

export function wordWrap(text: string, columnWidth: number) {
  return WrappableText.create(text).wordWrap(ColumnWidth.create(columnWidth)).value();
}
