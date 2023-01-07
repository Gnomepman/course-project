import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, IUser, IUserStorage } from "../../utils";

export const Register = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const addUser = async () => {
        const response = await fetch(`${BASE_URL}/user/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: login,
                password: password,
                rights: 'user'
            } as IUser),
        }).catch(error => {
            window.alert(error);
            return;
        });

        if (response!.ok) {
            localStorage.setItem("user", JSON.stringify({
                name: login,
                _id: (await response!.json()).insertedId,
                rights: "user",
            } as IUserStorage));
            navigate("/");
        } else {
            setLogin("");
            setPassword("");
            toast.error(await response!.json(), {
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "80vh" }}>
                <h4>Create new user</h4>
                <Form onSubmit={(e) => { e.preventDefault(); addUser() }} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control type="text" placeholder="Login" autoComplete="off" value={login} onChange={(e) => setLogin(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Form.Text className="text-muted">
                        Already have an account? <Link to={"/login"}>Log in</Link>
                    </Form.Text>
                </Form>
            </div>
        </>
    )
}