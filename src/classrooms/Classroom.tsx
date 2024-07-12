// Classroom.ts
import { Building } from "../buildings/Building";
import { ClassroomType } from "../classrooms_types/ClassroomType";

export class Classroom {
  id: number | undefined;
  building: number = 0;
  building_object: Building | undefined;
  floor: number = 0;
  number: number = 0;
  name: string = '';
  type_c: number = 0;
  type_c_object: ClassroomType | undefined;
  description: string = '';

  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.building) this.building = initializer.building;
    if (initializer.building_object) this.building_object = new Building(initializer.building_object);
    if (initializer.floor) this.floor = initializer.floor;
    if (initializer.number) this.number = initializer.number;
    if (initializer.name) this.name = initializer.name;
    if (initializer.type_c) this.type_c = initializer.type_c;
    if (initializer.type_c_object) this.type_c_object = new ClassroomType(initializer.type_c_object);
    if (initializer.description) this.description = initializer.description;
  }
}
