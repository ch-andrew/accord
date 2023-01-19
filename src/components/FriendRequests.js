import '../styles/components.css'
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, declineFriendRequest } from '../redux/userReducer';

const FriendRequests = () => {
    const dispatch = useDispatch()

    const userInfo = useSelector((state) => state.user)
    const { username, friendRequests } = userInfo
  
    return (
        <section className='friend-requests'>
          {friendRequests && friendRequests.map((request, index) => {
            return (
              <div key={index} className='request'>
                <img className="recipient-photo" src="https://i.stack.imgur.com/l60Hf.png" alt="profile pic"/>
                <div className='details'> 
                  <h2>{request}</h2>
                  <p>Sent a friend request</p>
                </div>
                <div className='actions'>
                  <i className='fa-solid fa-check success' onClick={() => dispatch(acceptFriendRequest({from: username, username: request}))}></i>
                  <i className='fa-solid fa-xmark danger' onClick={() => dispatch(declineFriendRequest({from: username, username: request}))}></i>
                </div>
              </div>
            )
          })}
        </section>
    );
}
 
export default FriendRequests;