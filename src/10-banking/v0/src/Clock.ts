export class Clock {
  todayAsString() {
    const today = this.today();
    const formattedToday = today.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

    return formattedToday;
  }

  protected today() {
    return new Date();
  }
}
