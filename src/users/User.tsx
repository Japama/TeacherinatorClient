import { Department } from "../departments/Department";

export class User {
    id: number | undefined;
    username: string = '';
    is_admin: boolean = false;
    pwd: string = '';
    active: boolean = false;
    department_id: number = 0;
    department: Department | undefined;
    in_center: boolean = false;
    last_checkin: [number, number, number, number] = [0, 0, 0, 0];
    last_checkout: [number, number, number, number] = [0, 0, 0, 0];
    substituting_id: number | undefined;
    substitutions: number = 0;
    
    get isNew(): boolean {
      return this.id === undefined;
    }
  
    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer.id) this.id = initializer.id;
      if (initializer.username) this.username = initializer.username;
      if (initializer.is_admin) this.is_admin = initializer.is_admin;
      if (initializer.pwd) this.pwd = initializer.pwd;
      if (initializer.department_id) this.department_id = initializer.department_id;
      if (initializer.department) this.department = new Department(initializer.department);
      if (initializer.active) this.active = initializer.active;
      if (initializer.in_center) this.in_center = initializer.in_center;
      if (initializer.last_checkin) this.last_checkin = initializer.deplast_checkinartment_id;
      if (initializer.last_checkout) this.last_checkout = initializer.last_checkout;
      if (initializer.substituting_id) this.substituting_id = initializer.substituting_id;
      if (initializer.substitutions) this.substitutions = initializer.substitutions;
    }
  }
  