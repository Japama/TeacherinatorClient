export class Group {
  id: string | undefined;
  course: number = 0;
  stage: number = 0;
  year: number = 0;
  letter: string = '';
  tutor_id: string | undefined;

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.course) this.course = initializer.course;    
    if (initializer.stage) this.stage = initializer.stage;
    if (initializer.year) this.year = initializer.year;
    if (initializer.letter) this.letter = initializer.letter;
    if (initializer.tutor_id) this.tutor_id = initializer.tutor_id;
  }
}
