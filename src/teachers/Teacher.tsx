import { Department } from "../departments/Department";
import { User } from "../users/User";

export class Teacher {
  id: string | undefined;
  user_id: number = 0;
  user: User | undefined;
  active: boolean = false;
  department_id: string = '';
  department: Department | undefined;
  username: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.user_id) this.user_id = initializer.user_id;
    if (initializer.active) this.active = initializer.active;
    if (initializer.department_id) this.department_id = initializer.department_id;
    if (initializer.department) this.department = new Department(initializer.department);
    if (initializer.user) this.user = new User(initializer.user);
    if (initializer.username) this.username = initializer.username;
  }
}
