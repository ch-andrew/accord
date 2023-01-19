import '../styles/components.css'
import { useDispatch, useSelector } from 'react-redux';

const Friends = () => {
  
    const userInfo = useSelector((state) => state.user)
    const { friends } = userInfo

    return (
        <section className='friend-list'>
            <div className='number-of-friends'>
                <h4>Friends</h4>
                <span>{friends.length}</span>
            </div>
            {friends && friends.map(friend => {
                return (
                    <div key={friend}>{friend}</div>
                )
            })}
        </section>
    );
}
 
export default Friends;