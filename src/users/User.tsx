export class User {
    id: string | undefined;
    username: string = '';
    isadmin: boolean = false;
    pwd: string = '';
    get isNew(): boolean {
      return this.id === undefined;
    }
  
    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer.id) this.id = initializer.id;
      if (initializer.username) this.username = initializer.username;
      if (initializer.isadmin) this.isadmin = initializer.isadmin;
      if (initializer.pwd) this.pwd = initializer.pwd;
    }
  }
  