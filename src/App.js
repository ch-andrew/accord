import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './fb';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Home from './components/Home';
import Loading from './components/Loading';
import { requestUserInfo } from './redux/userReducer';
import './App.css';


function App() {
  const [user, loading, error] = useAuthState(auth)
  const [showComponent, setComponent] = useState('login')

  const dispatch = useDispatch()

  useEffect(() =>{
    if(user){
      dispatch(requestUserInfo(user.uid))
    }
  },[user, dispatch])

  return (
    <div className='app'>
      {loading && <Loading />}
      {!loading && showComponent === 'login' && !user && <LoginForm stateFn={setComponent}/>}
      {!loading && showComponent === 'signup' && !user && <SignUpForm stateFn={setComponent}/>}
      {error && <h1>{error}</h1>}
      {user && <Home />}
    </div>
  );
}

export default App;
