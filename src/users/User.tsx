export class User {
    id: string | undefined;
    username: string = '';
    isadmin: boolean = false;
    teacher: string = '';
    department: string = ''
    active: boolean = false;

    get isNew(): boolean {
      return this.id === undefined;
    }
  
    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer.id) this.id = initializer.id;
      if (initializer.username) this.username = initializer.username;
      if (initializer.department) this.department = initializer.department;
      if (initializer.isadmin) this.isadmin = initializer.isadmin;
      if (initializer.teacher) this.teacher = initializer.teacher;
      if (initializer.active) this.active = initializer.active;
    }
  }
  