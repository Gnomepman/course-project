import { useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, IGroup, IIds, IStudent, ISubject } from "../../utils";
import Back from "../../assets/back.png"

export const Subject = () => {
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const [subject, setSubject] = useState({} as ISubject);
    const [groupList, setGroupList] = useState([] as IGroup[]);

    const handleAddStudentModalClose = () => setShow(false);
    const handleAddStudentModalShow = () => setShow(true);

    useEffect(() => {
        getGroupsForThisSubject();
        getAndSetGroups();
    }, []);

    useEffect(() => {
        getAndSetGroups();
    }, [subject.listOfGroups])

    const getGroupsForThisSubject = async () => {
        const response = await fetch(`${BASE_URL}/subject/${id}`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const subject: ISubject = await response.json();
        setSubject(subject);
    }

    const getAndSetGroups = async () => {
        const response = await fetch(`${BASE_URL}/group/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const groups: IGroup[] = await response.json();
        setGroupList(groups.filter(elem =>!elem.listOfSubjects!.includes(subject._id as unknown as IIds)));
        // setGroupList(groups);
    }

    const addToTheSubject = async (groupId: string) => {
        setShow(false);
        await fetch(`${BASE_URL}/subject/${subject._id}/group/${groupId}`, {
            method: "POST",
        });
        getGroupsForThisSubject();
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/subject">
                    <Button style={{ display: 'flex', gap: '10px' }} className="action_button">
                        <img src={Back} height="20px" alt="back"></img>
                        Back
                    </Button>
                </Link>
                <h3>{`Subject ${subject.name}`}</h3>
                <Button onClick={handleAddStudentModalShow}>Assign groups to the subject</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cafedra</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subject.listOfGroups && subject.listOfGroups.map((elem, index) => (
                            <Row elem={elem} key={index} getGroupsForThisSubject={getGroupsForThisSubject} subject={subject} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddStudentModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign groups to the subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ overflowY: "scroll", maxHeight: "70vh" }}>
                        <ListGroup>
                            {groupList && groupList.map((elem, index) => (
                                <ListGroup.Item action onClick={() => addToTheSubject(elem._id)} key={index}>
                                    {elem.name} "{elem.cafedra}"
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


const Row = (props: { elem: IIds, getGroupsForThisSubject: () => Promise<void>, subject: ISubject }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [name, setName] = useState("");
    const [cafedra, setCafedra] = useState("");

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async () => {
        await fetch(`${BASE_URL}/subject/${props.subject._id}/group/${props.elem}`, {
            method: "DELETE",
        });
        props.getGroupsForThisSubject();
        handleCloseDeletionConfirmation();
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(`${BASE_URL}/group/${props.elem}`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText} `;
                window.alert(message);
                return;
            }

            const group: IGroup = await response.json();
            setName(group.name);
            setCafedra(group.cafedra);
        })();
    }, []);

    return (
        <>
            <tr>
                <td >{name}</td>
                <td >{cafedra}</td>
                <td>
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete from subject</button>
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to remove group "${name}" from subject "${props.subject.name}"?`}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeletionConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => confirmDeletion()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}