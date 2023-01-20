import '../styles/components.css'
import { useDispatch, useSelector } from 'react-redux';
import { addConversationAction } from '../redux/conversationReducer';

const Profile = () => {
    const dispatch = useDispatch()
  
    const userInfo = useSelector((state) => state.user)
    const { username } = userInfo

    return (
        <></>
    );
}
 
export default Profile;