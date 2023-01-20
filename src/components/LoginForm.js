import { useState } from "react";
import { login } from "../fb";
import '../styles/components.css'

function LoginForm({stateFn}) {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState(null)

    const validateForm = (e) => {
        e.preventDefault()
        setEmailError('')
        setPasswordError('')
        const emailFormat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
        if(!emailFormat.test(email)){
            setEmailError('Please enter a valid email address')
        }
        if(!emailError && !passwordError){
            login(email, password)
                .then(res => {
                    console.log(res);
                    if(res.error){
                        setError(res.error)
                    }
                })
        }
    }
  
    return (
        <section className='input-form'>
            <div className='top-section'>
                <h1>Accord</h1>
            </div>
            <form className='signin-form'>
                <h2>Login</h2>

                {/* Email */}
                <div className="input-label">
                    <label htmlFor='email'>Email</label>
                    {emailError && <span className='error-text'>{emailError}</span>}
                </div>
                <input type='email' name='email' required onChange={(e) => setEmail(e.target.value)}/>

                {/* Password */}
                <div className="input-label">
                    <label htmlFor='password'>Password</label>
                    {passwordError && <span className='error-text'>{passwordError}</span>}
                </div>
                
                <input type='password' name='password' required onChange={(e) => setPassword(e.target.value)}/>
                <button type='click' className='btn' onClick={e => validateForm(e)}>Login</button>
                <p>Need an account? <span onClick={() => stateFn('signup')}>Register</span></p>
            </form>
            <div className='error'>
                {error && <h3>{error}</h3>}
            </div>
        </section>
    );
}
 
export default LoginForm;