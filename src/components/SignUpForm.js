import { useState } from "react"
import { signup } from "../fb"
import '../styles/components.css'

function SignUpForm ({ stateFn }){
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [error, setError] = useState(null)

    const validateForm = (e) => {
        e.preventDefault()
        setEmailError('')
        setUsernameError('')
        setPasswordError('')
        const emailFormat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
        console.log(!username.length);
        if(!emailFormat.test(email)){
            setEmailError('Please enter a valid email address')
        }
        if(username.length < 6){
            console.log('test');
            setUsernameError('must be 6 characters or more')
        }
        if(password.length < 8){
            setPasswordError('must be 8 characters or more')
        }
        if(!emailError && !usernameError && !passwordError){
            onSignUp()
        }
    }

    const onSignUp = async () => {
        const { error } = await signup(email, password, username)
        if(error){
            await setError(error)
        }
    }
  
    return (
      <section className='input-form'>
        <div className='top-section'>
            <h1>Accord</h1>
        </div>
        <form className='signin-form'>
            <h2>Create an account</h2>
            {/* Email */}
            <div className="input-label">
                <label htmlFor='email'>Email</label>
                {emailError && <span className='error-text'>{emailError}</span>}
            </div>
            <input type='email' name='email' autoComplete="off" required onChange={(e) => setEmail(e.target.value)}/>
            {/* Username */}
            <div className="input-label">
                <label htmlFor='username'>Username</label>
                {usernameError && <span className='error-text'>{usernameError}</span>}
            </div>
            <input type='text' name='username' autoComplete="off" minLength={6} required onChange={(e) => setUsername(e.target.value)}/>
            {/* Password */}
            <div className="input-label">
                <label htmlFor='password'>Password</label>
                {passwordError && <span className='error-text'>{passwordError}</span>}
            </div>
            <input type='password' name='password' required onChange={(e) => setPassword(e.target.value)}/>
            {
                email && username && password ?
                <input type='submit' value='Register' className='btn' onClick={e => validateForm(e)}/> :
                <input type='submit' value='Register' className='btn' disabled/> 
            }
            <span onClick={() => stateFn('login')}>Already have an account?</span>
        </form>
        {error && (
            <div className='error'>
                <h3>{error}</h3>
            </div>
        )}
      </section>
    )
}

export default SignUpForm;