import React, { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { BASE_URL, IProfessor } from "../../utils";

export const ProfessorList = () => {
    const [professorList, setProfessorList] = useState([] as IProfessor[]);
    const [show, setShow] = useState(false);
    const [modalName, setModalName] = useState("");
    const [modalSurname, setModalSurname] = useState("");
    const [modalSex, setModalSex] = useState("");
    const [modalEmail, setModalEmail] = useState("");
    const [modalCafedra, setModalCafedra] = useState("");

    const handleAddProfessorModalClose = () => {
        setModalName("")
        setModalSurname("");
        setModalSex("");
        setModalEmail("");
        setModalCafedra("");
        setShow(false);
    };

    const handleAddProfessorModalShow = () => setShow(true);

    useEffect(() => {
        getAndSetProfessors();
    }, []);

    const addProfessor = async () => {
        await fetch(`${BASE_URL}/professor/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
                cafedra: modalCafedra,
            } as IProfessor),
        }).catch(error => {
            window.alert(error);
            return;
        });

        handleAddProfessorModalClose();
        getAndSetProfessors();
    };

    const getAndSetProfessors = async () => {
        const response = await fetch(`${BASE_URL}/professor/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const professors: IProfessor[] = await response.json();
        setProfessorList(professors);
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <h3>Professors List</h3>
                <Button onClick={handleAddProfessorModalShow}>Create professor</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Sex</th>
                            <th>E-mail</th>
                            <th>Cafedra</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {professorList && professorList.map((elem, index) => (
                            <Row elem={elem} key={index} getAndSetProfessors={getAndSetProfessors} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddProfessorModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new professor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addProfessor}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSurname}
                                onChange={(event) => setModalSurname(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sex</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSex}
                                onChange={(event) => setModalSex(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={modalEmail}
                                onChange={(event) => setModalEmail(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cafedra</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalCafedra}
                                onChange={(event) => setModalCafedra(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddProfessorModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addProfessor}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const Row = (props: { elem: IProfessor, getAndSetProfessors: () => Promise<void> }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [modalName, setModalName] = useState(props.elem.name);
    const [modalSurname, setModalSurname] = useState(props.elem.surname);
    const [modalSex, setModalSex] = useState(props.elem.sex);
    const [modalEmail, setModalEmail] = useState(props.elem.email);
    const [modalCafedra, setModalCafedra] = useState(props.elem.cafedra);

    const handleEditProfessorModalClose = () => {
        setShowEdit(false);
        setModalName(props.elem.name)
        setModalSurname(props.elem.surname);
        setModalSex(props.elem.sex);
        setModalEmail(props.elem.email);
        setModalCafedra(props.elem.cafedra);
    };
    const handleEditProfessorModalShow = () => setShowEdit(true);

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async (id: string) => {
        await fetch(`${BASE_URL}/professor/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
                cafedra: modalCafedra,
            } as IProfessor),
        });
        props.getAndSetProfessors();
        handleCloseDeletionConfirmation();
    }

    const updateProfessor = async () => {
        await fetch(`${BASE_URL}/professor/update/${props.elem._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                surname: modalSurname,
                sex: modalSex,
                email: modalEmail,
                cafedra: modalCafedra,
            } as IProfessor),
        }).catch(error => {
            window.alert(error);
            return;
        });

        handleEditProfessorModalClose();
        props.getAndSetProfessors();
    };

    return (
        <>
            <tr>
                <td >{props.elem.name}</td>
                <td >{props.elem.surname}</td>
                <td >{props.elem.sex}</td>
                <td >{props.elem.email}</td>
                <td >{props.elem.cafedra}</td>
                <td>
                    <button className="btn btn-link" onClick={handleEditProfessorModalShow}>Edit</button> {"|"}
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete</button>
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete professor "${props.elem.name} ${props.elem.surname}"?`}</Modal.Title>
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
            <Modal show={showEdit} onHide={handleEditProfessorModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit professor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateProfessor}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSurname}
                                onChange={(event) => setModalSurname(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sex</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalSex}
                                onChange={(event) => setModalSex(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={modalEmail}
                                onChange={(event) => setModalEmail(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cafedra</Form.Label>
                            <Form.Control
                                type="text"
                                value={modalCafedra}
                                onChange={(event) => setModalCafedra(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditProfessorModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateProfessor}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}