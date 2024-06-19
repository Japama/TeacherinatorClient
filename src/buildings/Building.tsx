export class Building {
  id: number | undefined;
  building_name: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.building_name) this.building_name = initializer.building_name;
  }
}
