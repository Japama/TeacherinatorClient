export class Group {
  id: number | undefined;
  course: number = 0;
  stage: number = 0;
  year: number = 0;
  letter: string = '';
  tutor_name: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.year) this.year = initializer.year;
    if (initializer.stage) this.stage = initializer.stage;
    if (initializer.course) this.course = initializer.course;    
    if (initializer.letter) this.letter = initializer.letter;
    if (initializer.tutor_name) this.tutor_name = initializer.tutor_name;
  }
}
