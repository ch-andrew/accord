import '../styles/components.css'
import { useDispatch, useSelector } from 'react-redux';
import { addConversationAction } from '../redux/conversationReducer';

const Friends = () => {
    const dispatch = useDispatch()
  
    const userInfo = useSelector((state) => state.user)
    const { username, friends } = userInfo

    const onAddFriendsConversation = (recipient) => {
        console.log(username, recipient);
        dispatch(addConversationAction({username: username, recipient}))
    }

    return (
        <section className='friend-list'>
            <div className='number-of-friends'>
                <h4>Friends</h4>
                <span>{friends && friends.length}</span>
            </div>
            {friends && friends.map(friend => {
                return (
                    <div key={friend} onClick={() => onAddFriendsConversation(friend)}>{friend}</div>
                )
            })}
        </section>
    );
}
 
export default Friends;