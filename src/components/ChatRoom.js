import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/conversationReducer";
import { requestAddFriend, requestRemoveFriend } from "../redux/userReducer";
import { viewConversation } from '../redux/conversationReducer';


function ChatRoom(){
  const dispatch = useDispatch()
  
  const convo = useSelector(state => state.conversationList)
  const { conversations, currentConversation } = convo

  const userInfo = useSelector((state) => state.user)
  const { username, friends } = userInfo

  const arrConversation = conversations.filter(convo => {
    return convo.id === currentConversation
  })

  const conversation = arrConversation[0]

  const recipient = conversation.members.filter(member => {
    return member !== username
  })

  const messages = conversation.messages

  return (
    <div className={`chat-room ${!currentConversation && 'mobile-view'}`}>
      <section className='recipient'>
        <i className='fa-solid fa-arrow-left mobile-icon' onClick={() => dispatch(viewConversation())}></i>
        <img className="recipient-photo" src="https://i.stack.imgur.com/l60Hf.png" alt="recipient profile pic"/>
        <h2>{recipient}</h2>
        <div className="actions">
          {
            friends && friends.includes(recipient[0]) ? 
            <i className="fa-solid fa-user-minus danger" onClick={() => dispatch(requestRemoveFriend({from: username, username: recipient[0]}))}></i> : 
            <i className="fa-solid fa-user-plus primary" onClick={() => dispatch(requestAddFriend({from: username, username: recipient[0]}))}></i>
          }
          {/* {
            blocked && blocked.includes(recipient[0]) ? 
            <h4>blocked</h4> : 
            <i className="fa-solid fa-ban danger"></i>
          } */}
        </div>
      </section>
      <section className='conversation'>
        {messages && messages.map(msg => (
          <Messages key={msg.id} msg={msg} username={username} currentConversation={currentConversation} createdAt={msg.createdAt}/>
        ))}
      </section> 
      <SendMessage currentConversation={currentConversation} username={username} />
    </div>
  )
}

function SendMessage({ currentConversation, username }){
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  const onSendMessage = (e) => {
    e.preventDefault()
    dispatch(addMessage({currentConversation, message, username}))
    document.querySelector('#message').value = ''
    setMessage('')
  }

  return (
    <section className='input-message-container'>
        <form className='input-message' onSubmit={e => onSendMessage(e)}>
            <input id='message' type='text' name='message' placeholder='Message' onChange={(e) => setMessage(e.target.value)}/>
            {
              message ? 
              <button className='btn' type="button" onClick={onSendMessage}>Send</button> :
              <button className='btn' type="button" disabled>Send</button> 
            }
        </form>
    </section>
  )
}


function Messages({ msg, username, currentConversation, createdAt }){
  // const dispatch = useDispatch()
  const { from, message } = msg
  const messageClass = from === username ? 'sent' : 'received'

  const onDeleteMessage = (messageID) => {
    // dispatch(deleteMessage({currentConversation, messageID, username}))
  }

  return (
    <div className='message'>
      <h4 className={messageClass}>{from}</h4>
      <div className={messageClass}>
        {
          username === from ?
          <p onClick={() => onDeleteMessage(msg.id)}>{message}</p> :
          <p>{message}</p> 
        }
        <span>{createdAt}</span>
      </div>
    </div>
  )
}   

export default ChatRoom