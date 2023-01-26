import { useDispatch } from "react-redux"
import { logout } from "../fb"
import { resetConversations } from "../redux/conversationReducer"
import { resetUsers } from "../redux/userReducer"

function LogoutButton({element}) {
    const dispatch = useDispatch()

    const onLogout = () => {
      logout()
      dispatch(resetConversations())
      dispatch(resetUsers())
    }
  
    return (
      <>
        {element === 'button' &&  <button className="btn btn-danger" type='button' onClick={onLogout}>Logout</button>}
        {element === 'text' &&  <span className="link danger" onClick={onLogout}>Logout</span>}
      </>
    )
}

export default LogoutButton
  