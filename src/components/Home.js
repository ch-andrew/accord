import { useEffect, useState } from 'react';
import '../styles/components.css'
import LogoutButton from './LogoutButton';
import ChatRoom from './ChatRoom';
import { useDispatch, useSelector } from 'react-redux';
import { addConversationAction, conversationListRequest, viewConversation } from '../redux/conversationReducer';
import Conversations from './Conversations';
import Friends from './Friends';
import { queryTest } from '../fb';
import FriendRequests from './FriendRequests';

function Home() {
  const dispatch = useDispatch()

  const convo = useSelector((state) => state.conversationList)
  const { conversations, currentConversation, error: conversationsError } = convo

  const userInfo = useSelector((state) => state.user)
  const { username, friendRequests, friends } = userInfo

  const [ modal, showModal ] = useState(false)
  const [ recipient, setRecipient ] = useState('')

  const [ tab, showTab ] = useState('conversations')

  useEffect(() => {
     dispatch(conversationListRequest(username))
  }, [username, dispatch, currentConversation, modal])

  const onAddConversation = () => {
    dispatch(addConversationAction({username: username, recipient}))
  }

  return ( 
    <div className='home'>

      <div className='navigation'>
        <section className='profile'>
          {username && <h2>{username}</h2>}
          <LogoutButton element='text'/>
          <i className="fa-solid fa-message" onClick={() => showModal(true)}></i>
        </section>

        <section className='tab'>
          <h4 className={tab === 'conversations' ? 'active' : ''} onClick={() => showTab('conversations')}>Conversations</h4>
          <h4 className={tab === 'requests' ? 'active' : ''} onClick={() => showTab('requests')}>Requests</h4>
        </section>
        { tab === 'requests' && <FriendRequests/>}
        {tab === 'conversations' && <Conversations/>}
        {/* <button className='btn' onClick={() => queryTest()}>Test</button> */}
      </div>

      { conversations.length > 0 && currentConversation ?
        <ChatRoom /> :
        <div className='empty-chat-room'></div>
      }
      {
        modal &&
        <section className='modal'>
          <h2>Start a conversation</h2>
          <div className='search-bar'>
            <input id='username' type='text' name='username' placeholder='Username' onChange={(e) => setRecipient(e.target.value)}/>
            <button className='btn' onClick={() => onAddConversation()}>Start</button>
            {conversationsError && <h4>{conversationsError}</h4>}
          </div>
          <Friends/>
        </section>
      }
      {
        modal && <section className='modal-bg' onClick={() => showModal(false)}><div></div></section>
      }
    </div>
  )
}

export default Home