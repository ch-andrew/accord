import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signup } from "../fb"
import '../styles/components.css'
import { addConversationAction, addMessage } from "../redux/conversationReducer"
import { queryTest } from "../fb"

function SignUpForm ({ stateFn }){
    const dispatch = useDispatch()
    const convo = useSelector((state) => state.conversationList)
    const { currentConversation } = convo

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

    const newConversation = async () => {
        dispatch(addConversationAction({username, recipient: 'chandrew'}))
        return true
    }

    const sendWelcomeMessage = async () => {
        dispatch(addMessage({currentConversation, message: `Hi ${username}, Welcome to Accord!`, username: 'chandrew', to: username}))
        dispatch(addMessage({
            currentConversation, 
            message: 
                `My name is Andrew and I am the developer of this chat web app. You can talk and ask me about anything in here. 
                If you'd like to know more about me, you can visit my website at https://chandrew.gatsbyjs.io/ `, 
            username: 'chandrew',
            to: username}))
    }

    const testMessage = async (e) => {
        e.preventDefault()
        const { error } = await signup(email, password, username)
        if(error){
            setError(error)
        }
        const response = await newConversation()

    }

    const onSignUp = async () => {
        const { error } = await signup(email, password, username)
        if(error){
            setError(error)
        }
        newConversation()
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
            {/* <button className='btn' onClick={(e) => testMessage(e)}>Test</button> */}
            <span onClick={() => stateFn('login')}>Already have an account?</span>
        </form>
        {error && (
            <div className='error'>
                <p className="danger">{error}</p>
            </div>
        )}
      </section>
    )
}

export default SignUpForm;