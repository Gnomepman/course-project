import { useState } from "react";
import { Button, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, IUser, IUserStorage } from "../../utils";

export const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logIn = async () => {
        const response = await fetch(`${BASE_URL}/user/login/${login}/password/${password}`);

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText} `;
            window.alert(message);
            return;
        }

        const user: IUser = await response.json();

        if (user) {
            localStorage.setItem("user", JSON.stringify({
                name: user.login,
                _id: user._id,
                rights: user.rights,
            } as IUserStorage));
            navigate("/");
        } else {
            setLogin("");
            setPassword("");
            toast.error("Wrong login or password", {
                autoClose: 3000,
            });
        }
    }

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "80vh" }}>
                <h4>In order to access database, you have to be logged in</h4>
                <Form onSubmit={(e) => { e.preventDefault(); logIn() }} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
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
                        Don't have an account? <Link to={"/register"}>Regiser</Link>
                    </Form.Text>
                </Form>
            </div>
        </>
    )
}
