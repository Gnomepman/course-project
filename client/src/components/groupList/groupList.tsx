import React, { useEffect, useState } from "react";
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, IGroup } from "../../utils";

export const GroupList = () => {
    const [groupList, setGroupList] = useState([] as IGroup[]);
    const [show, setShow] = useState(false);
    const [modalName, setModalName] = useState("");
    const [modalCafedra, setModalCafedra] = useState("");

    const handleAddGroupModalClose = () => {
        setModalName("")
        setModalCafedra("");
        setShow(false);
    };

    const handleAddGroupModalShow = () => setShow(true);

    useEffect(() => {
        getAndSetGroups();
    }, []);

    const addGroup = async () => {
        const response = await fetch(`${BASE_URL}/group/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                cafedra: modalCafedra,
                listOfStudents: [],
            } as unknown as IGroup),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleAddGroupModalClose();
        getAndSetGroups();
    };

    const getAndSetGroups = async () => {
        const response = await fetch(`${BASE_URL}/group/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const groups: IGroup[] = await response.json();
        setGroupList(groups);
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <h3>Groups List</h3>
                <Button onClick={handleAddGroupModalShow}>Create group</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cafedra</th>
                            <th>Students</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupList && groupList.map((elem, index) => (
                            <Row elem={elem} key={index} getAndSetGroups={getAndSetGroups} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddGroupModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addGroup}>
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
                    <Button variant="secondary" onClick={handleAddGroupModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addGroup}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const Row = (props: { elem: IGroup, getAndSetGroups: () => Promise<void> }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [modalName, setModalName] = useState(props.elem.name);
    const [modalCafedra, setModalCafedra] = useState(props.elem.cafedra);

    const handleEditGroupModalClose = () => {
        setShowEdit(false);
        setModalName(props.elem.name)
        setModalCafedra(props.elem.cafedra);
    };
    const handleEditGroupModalShow = () => setShowEdit(true);

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async (id: string) => {
        await fetch(`http://localhost:5000/group/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                cafedra: modalCafedra,
            } as unknown as IGroup),
        });
        props.getAndSetGroups();
        handleCloseDeletionConfirmation();
    }

    const updateGroup = async () => {
        const response = await fetch(`${BASE_URL}/group/update/${props.elem._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: modalName,
                cafedra: modalCafedra,
            } as unknown as IGroup),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (!response!.ok) {
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }

        handleEditGroupModalClose();
        props.getAndSetGroups();
    };

    return (
        <>
            <tr>
                <td >{props.elem.name}</td>
                <td >{props.elem.cafedra}</td>
                <td ><Link className="btn btn-link" to={`/group/${props.elem._id}`} style={{ paddingLeft: "0px" }}>Students</Link></td>
                <td>
                    <button className="btn btn-link" onClick={handleEditGroupModalShow}>Edit</button> {"|"}
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete</button>
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to delete group "${props.elem.name}"?`}</Modal.Title>
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
            <Modal show={showEdit} onHide={handleEditGroupModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateGroup}>
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
                    <Button variant="secondary" onClick={handleEditGroupModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateGroup}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}