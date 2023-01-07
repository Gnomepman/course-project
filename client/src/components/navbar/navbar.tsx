import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, IUser } from "../../utils";
import { Button } from "react-bootstrap";

export default function Navbar() {
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav ml-auto d-flex">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/group">
                                Groups
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/professor">
                                Professors
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/student">
                                Students
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/subject">
                                Subjects
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/user">
                                Users
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/topSubjects">
                                Top subjects
                            </NavLink>
                        </li>
                        {isAuthenticated() &&
                            <li className="nav-item">
                                <Button onClick={logOut}>
                                    Log out
                                </Button>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    );
}