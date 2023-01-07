import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";
import { BASE_URL, IUser } from "../../utils";

//The user cannot be created without admin rights. Unless we resticts access to whole page. 
//Yes, the page will be accessible only for admins. All other pages can be viewed without admin rights
export const UserList = () => {
    const [userList, setUserList] = useState([] as IUser[]);
    const [show, setShow] = useState(false);
    const [modalLogin, setModalLogin] = useState("");
    const [modalPassword, setModalPassword] = useState("");
    const inputEl = useRef(null);
    const user: IUser = JSON.parse(localStorage.getItem("user")!);

    const handleAddUserModalClose = () => setShow(false);
    const handleAddUserModalShow = () => setShow(true);

    useEffect(() => {
        getAndSetUsers();
    }, []);

    const addUser = async () => {
        const response = await fetch(`${BASE_URL}/user/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: modalLogin,
                password: modalPassword,
                rights: (inputEl!.current as unknown as HTMLInputElement).checked ? 'admin' : 'user'
            } as IUser),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleAddUserModalClose();
        getAndSetUsers();
    };

    const getAndSetUsers = async () => {
        const response = await fetch(`${BASE_URL}/user/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const users: IUser[] = await response.json();
        setUserList(users);
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <h3>Users List</h3>
                {user.rights === "admin" &&

                    <Button onClick={handleAddUserModalShow}>Create user</Button>
                }
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Login</th>
                            <th>Password</th>
                            <th>Rights</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList && userList.map((elem, index) => (
                            <Row elem={elem} key={index} getAndSetUsers={getAndSetUsers} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddUserModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addUser}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Login</Form.Label>
                            <Form.Control
                                required
                                type="name"
                                autoFocus
                                value={modalLogin}
                                onChange={(event) => setModalLogin(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                value={modalPassword}
                                onChange={(event) => setModalPassword(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Rights</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    id="1"
                                    name="user_rights"
                                    type="radio"
                                    label="admin"
                                    ref={inputEl}
                                />
                                <Form.Check
                                    checked
                                    inline
                                    id="2"
                                    name="user_rights"
                                    type="radio"
                                    label="user"
                                    onChange={(event) => console.log(event)}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddUserModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addUser}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const Row = (props: { elem: IUser, getAndSetUsers: () => Promise<void> }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [modalLogin, setModalLogin] = useState(props.elem.login);
    const [modalPassword, setModalPassword] = useState(props.elem.password);
    const [modalRights, setModalRights] = useState(props.elem.rights === "admin");
    const user: IUser = JSON.parse(localStorage.getItem("user")!);

    const handleEditUserModalClose = () => {
        setShowEdit(false);
        setModalLogin(props.elem.login);
        setModalPassword(props.elem.password);
        setModalRights(props.elem.rights === "admin");
    };
    const handleEditUserModalShow = () => setShowEdit(true);

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async (id: string) => {
        await fetch(`${BASE_URL}/user/delete/${id}`, {
            method: "DELETE"
        });
        props.getAndSetUsers();
        handleCloseDeletionConfirmation();
    }

    const updateUser = async () => {
        const response = await fetch(`${BASE_URL}/user/update/${props.elem._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: modalLogin,
                password: modalPassword,
                rights: modalRights ? 'admin' : 'user'
            } as IUser),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleEditUserModalClose();
        props.getAndSetUsers();
    };

    return (
        <>
            <tr>
                <td >{props.elem.login}</td>
                <td >{user.rights === "admin" ? props.elem.password : "*******"}</td>
                <td >{props.elem.rights}</td>
                <td>
                    {user.rights === "admin" ? (
                        <>

                            <button className="btn btn-link" onClick={handleEditUserModalShow}>Edit</button>{"|"}
                            <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete</button>
                        </>
                    ) : (
                        <p>Only admin can edit and delete</p>
                    )
                    }
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete user "${props.elem.login}"?`}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeletionConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => confirmDeletion(props.elem._id)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEdit} onHide={handleEditUserModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUser}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Login</Form.Label>
                            <Form.Control
                                required
                                type="name"
                                autoFocus
                                value={modalLogin}
                                onChange={(event) => setModalLogin(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                value={modalPassword}
                                onChange={(event) => setModalPassword(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Rights</Form.Label>
                            <div>
                                <Form.Check
                                    checked={modalRights}
                                    inline
                                    id="1"
                                    name="user_rights"
                                    type="radio"
                                    label="admin"
                                    onChange={() => setModalRights(true)}
                                />
                                <Form.Check
                                    checked={!modalRights}
                                    inline
                                    id="2"
                                    name="user_rights"
                                    type="radio"
                                    label="user"
                                    onChange={() => setModalRights(false)}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditUserModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateUser}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}