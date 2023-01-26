import '../styles/components.css'
import { useDispatch, useSelector } from 'react-redux';
import { viewConversation } from '../redux/conversationReducer';

const Conversations = () => {
    const dispatch = useDispatch()

    const convo = useSelector((state) => state.conversationList)
    const { conversations, currentConversation } = convo
  
    const userInfo = useSelector((state) => state.user)
    const { username } = userInfo
  
    return (
        <section className='conversations-list'>
          {conversations && conversations.map(conversation => {
            const chatName = conversation.members.filter(member => {return member !== username})
            const selected = currentConversation === conversation.id ? 'conversation-active' : ''
            return (
              <div className={`conversation-list ${selected}`} key={conversation.id} onClick={() => dispatch(viewConversation(conversation.id))}>
                <img className="recipient-photo" src="https://i.stack.imgur.com/l60Hf.png" alt="profile pic"/>
                <div className='details'>
                  <h2>{conversation.name ? conversation.name : conversation.recipients[0].name}</h2>
                  
                  {conversation.messages.length > 0 && (
                    // <p>{conversation.messages[0].from}: {conversation.messages[0].message}</p>
                    <p>{conversation.messages[0].message}</p>
                  )}
                </div>
              </div>
            )
          })}
        </section>
    );
}
 
export default Conversations;