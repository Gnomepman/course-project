import React, { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { BASE_URL, IStudent } from "../../utils";

export const StudentList = () => {
    const [studentList, setStudentList] = useState([] as IStudent[]);
    const [show, setShow] = useState(false);
    const [modalName, setModalName] = useState("");
    const [modalSurname, setModalSurname] = useState("");
    const [modalSex, setModalSex] = useState("");
    const [modalEmail, setModalEmail] = useState("");

    const handleAddStudentModalClose = () => {
        setModalName("")
        setModalSurname("");
        setModalSex("");
        setModalEmail("");
        setShow(false);
    };
    const handleAddStudentModalShow = () => setShow(true);

    useEffect(() => {
        getAndSetStudents();
    }, []);

    const addStudent = async () => {
        await fetch(`${BASE_URL}/student/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
            } as IStudent),
        }).catch(error => {
            window.alert(error);
            return;
        });

        handleAddStudentModalClose();
        getAndSetStudents();
    };

    const getAndSetStudents = async () => {
        const response = await fetch(`${BASE_URL}/student/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const students: IStudent[] = await response.json();
        setStudentList(students);
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <h3>Students List</h3>
                <Button onClick={handleAddStudentModalShow}>Create student</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Sex</th>
                            <th>E-mail</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentList && studentList.map((elem, index) => (
                            <Row elem={elem} key={index} getAndSetStudents={getAndSetStudents} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddStudentModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addStudent}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSurname}
                                onChange={(event) => setModalSurname(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Sex</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSex}
                                onChange={(event) => setModalSex(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={modalEmail}
                                onChange={(event) => setModalEmail(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddStudentModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addStudent}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const Row = (props: { elem: IStudent, getAndSetStudents: () => Promise<void> }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [modalName, setModalName] = useState(props.elem.name);
    const [modalSurname, setModalSurname] = useState(props.elem.surname);
    const [modalSex, setModalSex] = useState(props.elem.sex);
    const [modalEmail, setModalEmail] = useState(props.elem.email);

    const handleEditStudentModalClose = () => {
        setShowEdit(false);
        setModalName(props.elem.name)
        setModalSurname(props.elem.surname);
        setModalSex(props.elem.sex);
        setModalEmail(props.elem.email);
    };
    const handleEditStudentModalShow = () => setShowEdit(true);

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async (id: string) => {
        await fetch(`${BASE_URL}/student/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
            } as IStudent),
        });
        props.getAndSetStudents();
        handleCloseDeletionConfirmation();
    }

    const updateStudent = async () => {
        await fetch(`${BASE_URL}/student/update/${props.elem._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
            } as IStudent),
        }).catch(error => {
            window.alert(error);
            return;
        });

        handleEditStudentModalClose();
        props.getAndSetStudents();
    };

    return (
        <>
            <tr>
                <td >{props.elem.name}</td>
                <td >{props.elem.surname}</td>
                <td >{props.elem.sex}</td>
                <td >{props.elem.email}</td>
                <td>
                    <button className="btn btn-link" onClick={handleEditStudentModalShow}>Edit</button> {"|"}
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete</button>
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete student "${props.elem.name} ${props.elem.surname}"?`}</Modal.Title>
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
            <Modal show={showEdit} onHide={handleEditStudentModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateStudent}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSurname}
                                onChange={(event) => setModalSurname(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Sex</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSex}
                                onChange={(event) => setModalSex(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={modalEmail}
                                onChange={(event) => setModalEmail(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditStudentModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateStudent}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}