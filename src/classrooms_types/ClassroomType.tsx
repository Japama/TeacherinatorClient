export class ClassroomType {
  id: number | undefined;
  type_name: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.type_name) this.type_name = initializer.type_name;
  }
}
