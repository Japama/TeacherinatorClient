export class Teacher {
  id: string | undefined;
  user_id: string = '';
  active: string = '';
  department_id: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.user_id) this.user_id = initializer.user_id;
    if (initializer.active) this.active = initializer.active;
    if (initializer.department_id) this.department_id = initializer.department_id;
  }
}
