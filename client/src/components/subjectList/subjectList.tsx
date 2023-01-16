import React, { useEffect, useState } from "react";
import { Button, ListGroup, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, IProfessor, ISubject } from "../../utils";

export const SubjectList = () => {
    const [subjectList, setSubjectList] = useState([] as ISubject[]);
    const [show, setShow] = useState(false);
    const [modalName, setModalName] = useState("");

    const handleAddSubjectModalClose = () => {
        setModalName("")
        setShow(false);
    };

    const handleAddSubjectModalShow = () => setShow(true);

    useEffect(() => {
        getAndSetSubjects();
    }, []);

    const addSubject = async () => {
        const response = await fetch(`${BASE_URL}/subject/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
            } as unknown as ISubject),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleAddSubjectModalClose();
        getAndSetSubjects();
    };

    const getAndSetSubjects = async () => {
        const response = await fetch(`${BASE_URL}/subject/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const subjects: ISubject[] = await response.json();
        setSubjectList(subjects);
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <h3>Subjects List</h3>
                <Button onClick={handleAddSubjectModalShow}>Create subject</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Professor</th>
                            <th>Groups</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjectList && subjectList.map((elem, index) => (
                            <Row elem={elem} key={index} getAndSetSubjects={getAndSetSubjects} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddSubjectModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addSubject}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddSubjectModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addSubject}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const Row = (props: { elem: ISubject, getAndSetSubjects: () => Promise<void> }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showProfessorDeletionConfirmation, setShowProfessorDeletionConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAddProfessor, setShowAddProfessor] = useState(false);
    const [modalName, setModalName] = useState(props.elem.name);
    const [professor, setProfessor] = useState({} as IProfessor);
    const [professorList, setProfessorList] = useState([] as IProfessor[]);

    useEffect(() => {
        getAndSetProfessors();
        (async () => {
            if (props.elem.professorId) {
                await assignProfessor(props.elem.professorId);
            }
        })()
    }, []);

    const handleEditSubjectModalClose = () => {
        setShowEdit(false);
        setModalName(props.elem.name)
    };

    const handleEditSubjectModalShow = () => setShowEdit(true);

    const handleAddProfessorModalClose = () => setShowAddProfessor(false);
    const handleAddProfessorModalShow = () => setShowAddProfessor(true);

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const handleCloseProfessorDeletionConfirmation = () => setShowProfessorDeletionConfirmation(false);
    const handleShowProfessorDeletionConfirmation = () => setShowProfessorDeletionConfirmation(true);

    const confirmSubjectDeletion = async (id: string) => {
        await fetch(`http://localhost:5000/subject/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
            } as unknown as ISubject),
        });
        props.getAndSetSubjects();
        handleCloseDeletionConfirmation();
    }

    const confirmProfessorDeletion = async (id: string) => {
        await fetch(`http://localhost:5000/subject/${id}/professor/${professor._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
            } as unknown as ISubject),
        });
        props.getAndSetSubjects();
        handleCloseProfessorDeletionConfirmation();
    }

    const updateSubject = async () => {
        const response = await fetch(`${BASE_URL}/subject/update/${props.elem._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
            } as unknown as ISubject),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleEditSubjectModalClose();
        props.getAndSetSubjects();
    };

    const assignProfessor = async (professorId: string) => {
        const response = await fetch(`${BASE_URL}/professor/${professorId}`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const professor: IProfessor = await response.json();
        setProfessor(professor);
    }

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

    const addProfessorToTheSubject = async (professorId: string) => {
        setShowAddProfessor(false);
        await fetch(`${BASE_URL}/subject/${props.elem._id}/professor/${professorId}`, {
            method: "POST",
        });
        props.getAndSetSubjects();
        assignProfessor(professorId);
    }

    return (
        <>
            <tr>
                <td >{props.elem.name}</td>
                <td >{props.elem.professorId ?
                    <>
                        <div
                            style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                            {`${professor.name} ${professor.surname}`}
                            <Button variant="outline-danger" style={{ padding: "1px 5px" }} onClick={handleShowProfessorDeletionConfirmation}>Remove</Button>
                        </div>
                    </>
                    : <Button onClick={handleAddProfessorModalShow} variant="outline-primary" style={{ paddingLeft: "5px", paddingRight: "5px"}}>{"Add professor"}</Button>
                }</td>
                <td ><Link className="btn btn-link" to={`/subject/${props.elem._id}`} style={{ paddingLeft: "0px" }}>Groups</Link></td>
                <td>
                    <button className="btn btn-link" onClick={handleEditSubjectModalShow}>Edit</button> {"|"}
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete</button>
                </td>
            </tr>
            <Modal show={showProfessorDeletionConfirmation} onHide={handleCloseProfessorDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete professor "${professor.name} ${professor.surname}" from subject "${props.elem.name}"?`}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProfessorDeletionConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => confirmProfessorDeletion(props.elem._id)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddProfessor} onHide={handleAddProfessorModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign professor to the subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ overflowY: "scroll", maxHeight: "70vh" }}>
                        <ListGroup>
                            {professorList && professorList.map((elem, index) => (
                                <ListGroup.Item action onClick={() => addProfessorToTheSubject(elem._id)} key={index}>
                                    {elem.name} {elem.surname}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete subject "${props.elem.name}"?`}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeletionConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => confirmSubjectDeletion(props.elem._id)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEdit} onHide={handleEditSubjectModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateSubject}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                autoFocus
                                value={modalName}
                                onChange={(event) => setModalName(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditSubjectModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateSubject}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}