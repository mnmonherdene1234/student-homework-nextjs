export class Student {
  id: number;
  name: string;
  age: number;

  constructor(id: number = 0, name: string, age: number) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}
