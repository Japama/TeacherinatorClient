import { Department } from "../departments/Department";

  export class User {
    id: number | undefined;
    username: string = '';
    isadmin: boolean = false;
    pwd: string = '';
    inCenter: boolean = false;
    lastCheckin: Date | undefined;
    lastCheckout: Date | undefined;
    active: boolean = false;
    department_id: string = '';
    department: Department | undefined;

    get isNew(): boolean {
      return this.id === undefined;
    }

    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer.id) this.id = initializer.id;
      if (initializer.username) this.username = initializer.username;
      if (initializer.isadmin) this.isadmin = initializer.isadmin;
      if (initializer.pwd) this.pwd = initializer.pwd;
      if (initializer.inCenter) this.inCenter = initializer.inCenter;
      if (initializer.lastCheckin) this.lastCheckin = new Date(initializer.lastCheckin);
      if (initializer.lastCheckout) this.lastCheckout = new Date(initializer.lastCheckout);
      if (initializer.active) this.active = initializer.active;
      if (initializer.departmentId) this.department_id = initializer.department_id;
    }
  }