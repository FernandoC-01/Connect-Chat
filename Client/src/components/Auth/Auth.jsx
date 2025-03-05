import { useState } from "react"
import "./auth.css"
export default function Auth({ updateLocalStorage }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFName] = useState("")
    const [lastName, setLastName] = useState("")
    const [login, setLogin] = useState(true)

    const toggle = () => {
        setLogin(!login)
        setFName("")
        setLastName("")
        setPassword("")
        setEmail("")
    }

    const toggleBtn = () => login ? "Register" : "Login"
    const register = () => login ? null : (
        <>
            <input name="firstName" id="firstName" onChange={e => setFName(e.target.value)} type="text" placeholder="First Name" value={firstName} />
            <input name="lastName" id="lastName" onChange={e => setLastName(e.target.value)} type="text" placeholder="Last Name" value={lastName} />
        </>
    )

    const handleSubmit = e => {
        e.preventDefault()

        const url = login
            ? "http://127.0.0.1:4000/user-routes/login"
            : "http://127.0.0.1:4000/user-routes/register"

        const body = login
            ? { email, password }
            : { firstName, lastName, email, password }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then(data => {
            const { token, isAdmin } = data;
            updateLocalStorage(token, isAdmin); 
        });
    }

    return (
        <>
            <form action="" className="form-wrapper">
                {register()}
                <input name="email" id="email" onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter Email" value={email} />
                <input name="password" id="password" onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter Password" value={password} />
                <button onClick={handleSubmit} type="button">Go</button>
            </form>
            <button onClick={toggle}>{toggleBtn()}</button>
        </>
    )
}