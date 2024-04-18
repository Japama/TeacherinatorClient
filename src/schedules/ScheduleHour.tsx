export class ScheduleHour {
  id: number | undefined;
  schedule_id: number | undefined;
  subject_name: string = '';
  classroom_name: string = '';
  week_day: number = 0;
  n_hour: number = 0;
  start_time: [number, number, number, number] = [0, 0, 0, 0]; // Tupla de números para representar la hora de inicio
  end_time: [number, number, number, number] = [0, 0, 0, 0]; // Array de números para representar la hora de fin
  course: number = 0;

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.schedule_id) this.schedule_id = initializer.schedule_id;    
    if (initializer.subject_name) this.subject_name = initializer.subject_name;
    if (initializer.classroom_name) this.classroom_name = initializer.classroom_name;
    if (initializer.week_day) this.week_day = initializer.week_day;
    if (initializer.n_hour) this.n_hour = initializer.n_hour;
    if (initializer.start_time) this.start_time = initializer.start_time;
    if (initializer.end_time) this.end_time = initializer.end_time;
    if (initializer.course) this.course = initializer.course;
  }
}
