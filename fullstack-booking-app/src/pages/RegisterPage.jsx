import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerUser(e) {
        e.preventDefault()
        try{
            await axios.post('/register', {
                name,
                email,
                password
            });
            alert('Registration successful. Now you can log in')
        } catch (e) {
            alert('Registration failed. Please try again later')
        }

    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="-mt-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}/>
                    <input type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}/>
                    <button className="primary">Create an Account</button>
                    <div className="text-center py-2 text-gray-500">
                        <p>Already a member? <span className="underline text-black"><Link to ={'/login'}>Login</Link></span> </p>
                    </div>
                </form>
            </div>
        </div>
    )
}