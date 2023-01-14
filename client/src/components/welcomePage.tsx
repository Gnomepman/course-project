import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Background from '../assets/background.png'
import { isAuthenticated } from '../utils';

export const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }} className="app-container">
                <div style={{ width: "450px" }}>
                    <h1>Welcome to the University DB</h1>
                    <p style={{ fontSize: "24px" }}>Using our system, you can manage your university with ease! Add and remove students, professors, subjects, groups</p>
                    <Button onClick={() => {
                        isAuthenticated() ? navigate("/user") : navigate("/login");
                    }
                    } size="lg">Get started</Button>
                </div>
                <img src={Background} alt="" width="600px" />
            </div>
        </>
    )
}