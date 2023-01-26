import { useEffect, useState } from 'react';
import '../styles/components.css'
import LogoutButton from './LogoutButton';
import ChatRoom from './ChatRoom';
import { useDispatch, useSelector } from 'react-redux';
import { addConversationAction, conversationListRequest} from '../redux/conversationReducer';
import Conversations from './Conversations';
import Friends from './Friends';
// import { queryTest } from '../fb';
import FriendRequests from './FriendRequests';
import { updateProfileRequest } from '../redux/userReducer';

function Home() {
  const dispatch = useDispatch()

  const convo = useSelector((state) => state.conversationList)
  const { conversations, currentConversation, error: conversationsError } = convo

  const userInfo = useSelector((state) => state.user)
  const { username, displayName, status, friendRequests } = userInfo

  const [ profileModal, openProfile ] = useState(false)
  const [ editDisplayName, setEditDisplayName ] = useState(false)
  const [ inputDisplayName, setDisplayName ] = useState(displayName ? displayName  : '')
  const [ editStatus, setEditStatus ] = useState(false)
  const [ inputStatus, setStatus ] = useState(status ? status : '')

  const [ conversationModal, newConversation ] = useState(false)
  const [ recipient, setRecipient ] = useState('')

  const [ tab, showTab ] = useState('conversations')

  useEffect(() => {
    dispatch(conversationListRequest(username))
  }, [username, dispatch, currentConversation, conversationModal])

  const onAddConversation = () => {
    console.log(username, recipient);
    dispatch(addConversationAction({username: username, recipient}))
  }

  const onEditDisplayName = () => {
    if(inputDisplayName){
      dispatch(updateProfileRequest({username: username, query: 'displayName', data: inputDisplayName}))
      setEditDisplayName(false)
    }
    setEditDisplayName(false)
    setDisplayName('')
  }

  const onEditStatus = () => {
    if(inputStatus){
      dispatch(updateProfileRequest({username: username, query: 'status', data: inputStatus}))
      setEditStatus(false)
    }
    if(inputStatus.length === 0 || inputStatus === ''){
      dispatch(updateProfileRequest({username: username, query: 'status', data: ''}))
      setEditStatus(false)
    }
    setEditStatus(false)
    setStatus('')
  }

  return ( 
    <div className='home'>

      <div className={`navigation ${currentConversation ? 'mobile-view' : ''}`}>
        <section className='profile'>
          {username && <h2 onClick={() => openProfile(true)}>{displayName ? displayName : username}<span>{displayName && '@' + username}</span></h2>}
          <i className="fa-solid fa-message" onClick={() => newConversation(true)}></i>
        </section>

        <section className='tab'>
          <h4 className={tab === 'conversations' ? 'active' : ''} onClick={() => showTab('conversations')}>Conversations</h4>
          <h4 className={tab === 'requests' ? 'active' : ''} onClick={() => showTab('requests')}>Requests <span className='notifications'>{friendRequests && friendRequests.length > 0 && friendRequests.length}</span></h4>
        </section>
        { tab === 'requests' && <FriendRequests/>}
        {tab === 'conversations' && <Conversations/>}
        {/* <button className='btn' onClick={() => queryTest('chandrew')}>Test</button> */}
      </div>

      { conversations.length > 0 && currentConversation ?
        <ChatRoom /> :
        <div className='empty-chat-room'></div>
      }
      {
        profileModal && 
        <section className='modal modal-profile'>
          <div className='title'>
            <i className='fa-solid fa-arrow-left mobile-icon' onClick={() => openProfile(false)}></i>
            <h2>My Profile</h2>
          </div>
          <div className='user-profile'>
            <img className="profile-photo" src="https://i.stack.imgur.com/l60Hf.png" alt="profile pic"/>
            <h3 className='bold'>{`@${username}`}</h3>
          </div>
            <p className='neutral-light'>Display Name</p>
            {!editDisplayName && (
              <div className='display-name'>
                <p className={!displayName ? 'neutral' : ''}>{displayName ? displayName : 'Set your display name'}</p>
                  <i className='fa-solid fa-pen-to-square secondary' onClick={() => setEditDisplayName(true)}></i>
              </div>
            )}
            {(editDisplayName) && (
              <div className='edit display-name'>
                <input id='display-name' type='text' name='displayName' placeholder={displayName ? displayName : 'Set your display name'} onChange={(e) => setDisplayName(e.target.value)}/>
                <div className='actions'>
                  <p className={inputDisplayName.length === 20 ? 'danger' : ''}>{inputDisplayName.length} / 20 characters</p>
                  <i className='fa-solid fa-check success' onClick={() => onEditDisplayName()}></i>
                  <i className='fa-solid fa-xmark danger' onClick={() => setEditDisplayName(false)}></i>
                </div>
              </div>
            )}
            <p className='neutral-light'>Status message</p>
            {!editStatus && (
              <div className='status'>
                <p className={!status ? 'neutral' : ''}>{status ? status : 'Set a status message'}</p>
                <i className='fa-solid fa-pen-to-square secondary' onClick={() => setEditStatus(true)}></i>
              </div>
            )}
            {editStatus && (
              <div className='edit status'>
                <textarea id="status" name="status" onChange={(e) => setStatus(e.target.value)} maxLength={100} defaultValue={status && status} placeholder='Set a status message'></textarea>
                {/* <input id='display-name' type='textarea' name='displayName' placeholder={status ? status : 'Set a status message'} onChange={(e) => setStatus(e.target.value)}/> */}
                <div className='actions'>
                  <p className={inputStatus.length === 100 ? 'danger' : ''}>{inputStatus.length} / 100 characters</p>
                  <i className='fa-solid fa-check success' onClick={() => onEditStatus()}></i>
                  <i className='fa-solid fa-xmark danger' onClick={() => setEditStatus(false)}></i>
                </div>
              </div>
            )}
          <LogoutButton element='button'/>
        </section>
      }
      {
        profileModal && <section className='modal-bg' onClick={() => openProfile(false)}><div></div></section>
      }
      {
        conversationModal &&
        <section className='modal'>
          <div className='title'>
            <i className='fa-solid fa-arrow-left mobile-icon' onClick={() => newConversation(false)}></i>
            <h2>Start a conversation</h2>
          </div>
          <div className='search-bar'>
            <input id='username' type='text' name='username' placeholder='Username' onChange={(e) => setRecipient(e.target.value)}/>
            <button className='btn' onClick={() => onAddConversation()}>Start</button>
            {conversationsError && <h4>{conversationsError}</h4>}
          </div>
          <Friends newConversation={newConversation}/>
        </section>
      }
      {
        conversationModal && <section className='modal-bg' onClick={() => newConversation(false)}><div></div></section>
      }
    </div>
  )
}

export default Home