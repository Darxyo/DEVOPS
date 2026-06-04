export interface CounterStore {
  increment(): void;
  getCount(): number;
}

export class InMemoryCounterStore implements CounterStore {
  private count: number = 0;

  increment(): void {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}
