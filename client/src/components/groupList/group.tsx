import { useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, IGroup, IIds, IStudent } from "../../utils";
import Back from "../../assets/back.png"

export const Group = () => {
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const [group, setGroup] = useState({} as IGroup);
    const [studentList, setStudentList] = useState([] as IStudent[]);

    const handleAddStudentModalClose = () => setShow(false);
    const handleAddStudentModalShow = () => setShow(true);

    useEffect(() => {
        getStudentsForThisGroup();
        getAndSetStudents();
    }, []);

    useEffect(() => {
        getAndSetStudents();
    }, [group.listOfStudents])

    const getStudentsForThisGroup = async () => {
        const response = await fetch(`${BASE_URL}/group/${id}`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const group: IGroup = await response.json();
        setGroup(group);
    }

    const getAndSetStudents = async () => {
        const response = await fetch(`${BASE_URL}/student/`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const students: IStudent[] = await response.json();
        setStudentList(students.filter((elem) => !elem.groupId));
    }

    const addToTheGroup = async (studentId: string) => {
        setShow(false);
        await fetch(`${BASE_URL}/group/${group._id}/student/${studentId}`, { //Have to implement
            method: "POST",
        });
        getStudentsForThisGroup();
    }

    return (
        <>
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/group">
                    <Button style={{ display: 'flex', gap: '10px' }} className="action_button">
                        <img src={Back} height="20px" alt="back"></img>
                        Back
                    </Button>
                </Link>
                <h3>{`Group ${group.name}`}</h3>
                <Button onClick={handleAddStudentModalShow}>Add students to group</Button>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group.listOfStudents && group.listOfStudents.map((elem, index) => (
                            <Row elem={elem} key={index} getStudentsForThisGroup={getStudentsForThisGroup} group={group} />
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleAddStudentModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add student to the group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ overflowY: "scroll", maxHeight: "70vh" }}>
                        <ListGroup>
                            {studentList && studentList.map((elem, index) => (
                                <ListGroup.Item action onClick={() => addToTheGroup(elem._id)} key={index}>
                                    {elem.name} {elem.surname}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


const Row = (props: { elem: IIds, getStudentsForThisGroup: () => Promise<void>, group: IGroup }) => {
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const handleCloseDeletionConfirmation = () => setShowDeletionConfirmation(false);
    const handleShowDeletionConfirmation = () => setShowDeletionConfirmation(true);

    const confirmDeletion = async () => {
        await fetch(`${BASE_URL}/group/${props.group._id}/student/${props.elem}`, {
            method: "DELETE",
        });
        props.getStudentsForThisGroup();
        handleCloseDeletionConfirmation();
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(`${BASE_URL}/student/${props.elem}`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText} `;
                window.alert(message);
                return;
            }

            const student: IStudent = await response.json();
            setName(student.name);
            setSurname(student.surname);
        })();
    }, []);

    return (
        <>
            <tr>
                <td >{name}</td>
                <td >{surname}</td>
                <td>
                    <button className="btn btn-link" onClick={handleShowDeletionConfirmation}>Delete from group</button>
                </td>
            </tr>
            <Modal show={showDeletionConfirmation} onHide={handleCloseDeletionConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Are you sure you want to remove student "${name} ${surname}" from group "${props.group.name}"?`}</Modal.Title>
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