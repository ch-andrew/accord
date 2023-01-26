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
  const { username, friends, displayName } = userInfo

  const arrConversation = conversations.filter(convo => {
    return convo.id === currentConversation
  })

  const conversation = arrConversation[0]

  const { members } = conversation
  const recipient = conversation.recipients[0]


  const recipientUsername = members.filter(member => {
    return member !== username
  })

  const messages = conversation.messages

  return (
    <div className={`chat-room ${!currentConversation && 'mobile-view'}`}>
      <section className='recipient'>
        <i className='fa-solid fa-arrow-left mobile-icon' onClick={() => dispatch(viewConversation())}></i>
        <img className="recipient-photo" src="https://i.stack.imgur.com/l60Hf.png" alt="recipient profile pic"/>
        <div className='details'>
          <h2>{recipient.name === recipientUsername[0] ? '@' + recipientUsername[0] : recipient.name}<span>{recipient.name === recipientUsername[0] ? '' : '@' + recipientUsername[0]}</span></h2>
          <p>{recipient.status}</p>
        </div>
        <div className="actions">
          {
            friends && friends.includes(recipient.name) ? 
            <i className="fa-solid fa-user-minus danger" onClick={() => dispatch(requestRemoveFriend({from: username, username: recipientUsername[0]}))}></i> : 
            <i className="fa-solid fa-user-plus primary" onClick={() => dispatch(requestAddFriend({from: username, username: recipientUsername[0]}))}></i>
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
          <Messages key={msg.id} msg={msg} username={username} createdAt={msg.createdAt} displayName={displayName} recipient={recipient}/>
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


function Messages({ msg, username, createdAt, displayName, recipient }){
  // const dispatch = useDispatch()
  const { from, message } = msg
  const messageClass = from === username ? 'sent' : 'received'
  const sender = from === username ? displayName : recipient.name

  const onDeleteMessage = (messageID) => {
    // dispatch(deleteMessage({currentConversation, messageID, username}))
  }

  return (
    <div className='message'>
      <h4 className={messageClass}>{sender}</h4>
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