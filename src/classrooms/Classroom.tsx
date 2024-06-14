export class Classroom {
  id: number | undefined;
  building: string = '';
  floor: number = 0;
  number: number = 0;
  name: string = '';
  type_c: number = 0;
  description: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.building) this.building = initializer.building;
    if (initializer.floor) this.floor = initializer.floor;
    if (initializer.number) this.number = initializer.number;
    if (initializer.name) this.name = initializer.name;
    if (initializer.type_c) this.type_c = initializer.type_c;
    if (initializer.description) this.description = initializer.description;
  }
}
