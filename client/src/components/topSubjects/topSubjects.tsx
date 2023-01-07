import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BASE_URL, IProfessor, ISubject } from "../../utils";

export const TopSubjects = () => {
    const [subjectList, setSubjectList] = useState([] as ISubject[]);

    useEffect(() => {
        getAndSetTopSubjects();
    }, []);

    const getAndSetTopSubjects = async () => {
        const response = await fetch(`${BASE_URL}/topSubject/`);

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
                <h3>Top subjects</h3>
            </div>
            <div style={{ overflowY: "scroll", height: "80vh" }}>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Professor</th>
                            <th>Number of groups</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjectList && subjectList.map((elem, index) => (
                            <Row elem={elem} key={index} index={index + 1}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

const Row = (props: { elem: ISubject, index: number }) => {

    const [professor, setProfessor] = useState({} as IProfessor);

    useEffect(() => {
        (async () => {
            if (props.elem.professorId) {
                await assignProfessor(props.elem.professorId);
            }
        })()
    }, []);

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

    return (
        <>
            <tr>
                <td >{props.index}</td>
                <td >{props.elem.name}</td>
                <td >{props.elem.professorId ?
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {`${professor.name} ${professor.surname}`}
                        </div>
                    </>
                    : <div> - </div>
                }</td>
                <td>{props.elem.numberOfGroups}</td>
                <td ><Link className="btn btn-link" to={`/subject/${props.elem._id}`} style={{ paddingLeft: "0px" }}>Groups</Link></td>
            </tr>
        </>
    )
}