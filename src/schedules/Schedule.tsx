import { Group } from "../groups/Group";
import { User } from "../users/User";

export class Schedule {
  id: number | undefined;
  user_id: number | undefined;
  group_id: number | undefined;
  course: number = 0;
  group: Group | undefined;
  user: User | undefined;

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.course) this.course = initializer.course;    
    if (initializer.user_id) this.user_id = initializer.user_id;
    if (initializer.group_id) this.group_id = initializer.group_id;
    if (initializer.group) this.group = initializer.group;
    if (initializer.user) this.user = initializer.user;
  }
  
}
