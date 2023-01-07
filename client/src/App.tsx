import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import { UserList } from "./components/userList/userList";
import { StudentList } from "./components/studentsList/studentList";
import { ProfessorList } from "./components/professorList/professorList";
import { GroupList } from "./components/groupList/groupList";
import { Group } from "./components/groupList/group";
import { SubjectList } from "./components/subjectList/subjectList";
import { Subject } from "./components/subjectList/subject";
import { TopSubjects } from "./components/topSubjects/topSubjects";
import { IsLoggedRoute } from "./components/routes/isLoggedRoute";
import { PrivateRoute } from "./components/routes/privateRoute";
import { WelcomePage } from "./components/welcomePage";
import { Login } from "./components/login/login";
import { Register } from "./components/register/register";
import { ToastContainer } from "react-toastify";
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Navbar />
      <div style={{ margin: 20 }}>
      <ToastContainer position="top-right" hideProgressBar={false} theme="colored" />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/user" element={<UserList />} />
            <Route path="/student" element={<StudentList />} />
            <Route path="/professor" element={<ProfessorList />} />
            <Route path="/group" element={<GroupList />} />
            <Route path="/group/:id" element={<Group />} />
            <Route path="/subject" element={<SubjectList />} />
            <Route path="/subject/:id" element={<Subject />} />
            <Route path="/topSubjects" element={<TopSubjects />} />
          </Route>
          <Route path="/" element={<IsLoggedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/" element={<PrivateRoute />}></Route>
        </Routes>
      </div>
    </>
  );
};

export default App;