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
        {element === 'button' &&  <button className="btn btn-secondary" type='button' onClick={onLogout}>Logout</button>}
        {element === 'text' &&  <a onClick={onLogout}>Logout</a>}
      </>
    )
}

export default LogoutButton
  