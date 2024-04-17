export class Schedule {
  id: number | undefined;
  teacher_id: number | undefined;
  group_id: number | undefined;
  course: number = 0;

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.course) this.course = initializer.course;    
    if (initializer.teacher_id) this.teacher_id = initializer.teacher_id;
    if (initializer.group_id) this.group_id = initializer.group_id;
  }
}
