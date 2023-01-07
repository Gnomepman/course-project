export const BASE_URL = 'http://localhost:5000';

export interface IIds {
  _id: string;
}

export interface IUser {
  _id: string;
  login: string;
  password: string;
  rights: 'admin' | 'user';
}

export interface IStudent {
  _id: string;
  name: string;
  surname: string;
  sex: 'male' | 'female' | string;
  email: string;
  groupId?: string;
}

export interface IProfessor {
  _id: string;
  name: string;
  surname: string;
  sex: 'male' | 'female' | string;
  email: string;
  cafedra: string;
}

export interface IGroup {
  _id: string;
  name: string;
  cafedra: string;
  listOfStudents: IIds[];
  listOfSubjects?: IIds[];
}

export interface ISubject {
  _id: string;
  name: string;
  professorId: string;
  listOfGroups: IIds[];
  numberOfGroups?: number;
}

export interface IUserStorage {
  _id: string;
  name: string;
  rights: 'admin' | 'user';
}

export const isAuthenticated = () => {
  return localStorage.getItem("user");
};
