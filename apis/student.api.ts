import { Student } from "../models/student.dto";
import request from "../utils/request";

export const get = (id: number) => request.get(`/students/${id}`);
export const list = () => request.get(`/students`);
export const create = (data: Student) =>
  request.post<Student>(`/students`, data);
export const update = (data: Student) =>
  request.put<Student>(`/students/${data.id}`, data);
export const remove = (id: number) => request.del(`/students/${id}`);

const studentAPI = {
  get,
  list,
  create,
  update,
  remove,
};

export default studentAPI;
