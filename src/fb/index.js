// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { 
  getFirestore, collection, 
  doc, 
  getDocs, 
  // getDoc, 
  addDoc, query, where, orderBy, serverTimestamp, deleteDoc, 
  // onSnapshot, getDoc, 
  updateDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword, signOut } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUpqmRpUNDVuA6RuYXm4uf4keyHbIGNfo",
  authDomain: "ch-accord-app.firebaseapp.com",
  projectId: "ch-accord-app",
  storageBucket: "ch-accord-app.appspot.com",
  messagingSenderId: "339010619506",
  appId: "1:339010619506:web:58832638e491df41851aeb"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
export const auth = getAuth()
export const usersRef = collection(db, 'users')
export const chatRef = collection(db, 'conversations')
// const messagesRef = collectionGroup(db, 'messages')

// onSnapshot(chatRef, (snapshot) => {
//   let conversations = []
//     snapshot.docs.forEach(doc => {
//       conversations.push({ ...doc.data(), id: doc.id})
//     })
//   console.log(conversations);
// })

const formatTime = (time) => {
  const night = time.includes('PM')
  // const day = time.includes('AM')

  if(night){
    let hour = parseInt(time.substring(0, 2)) + 12
    if(hour >= 24) hour = '00'
    const minutes = time.substring(2, time.length - 2)
    const newTime = hour + minutes
    return newTime
  }
  else {
    const newTime = time.substring(0, time.length - 2)
    return newTime
  }
}

export const login = (email, password) => {
    const response = signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user logged in', cred.user)
      return {
        data: cred.user,
        error: null
      }
    })
    .catch((err) => {
      console.log(err.message);
      const errorMessage = 'Invalid Email/Password'
      return {
        data: null,
        error: errorMessage
      }
    })
    return response
}

export const logout = () => {
  signOut(auth)
  console.log('logout');
}

export const signup = (email, password, username) => {
  const response = createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user registered', cred.user.uid);
      addDoc(usersRef, {
          username: username.toLowerCase(),
          authID: cred.user.uid,
        }
      )
      return {
        data: cred.user,
        error: null
      }
    })
    .catch((err) => {
      console.log(err.message);
      return {
        data: null,
        error: err.message
      }
    })
  return response
}

export const checkUsername = async (username) => {
  const q1 = query(usersRef, where('username', '==', username.toLowerCase()))
  const user = await getDocs(q1)
    .then(({ docs }) => {
      if(docs.length > 0){
        return true
      }
      else {
        return false
      }
    })
  return user
}

// Firebase Auth => Firestore
export const getUserInfo = async (authID) => {
  const user = auth.currentUser;
  let email

  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    email = user.email;
  }

  const q1 = query(usersRef, where('authID', '==', authID))
  const userInfo = await getDocs(q1)
    .then(({ docs }) => {
        console.log(docs[0].data());
        return {
          ...docs[0].data(), 
          id: docs[0].id
        }
    })

  return {
    ...userInfo,
    email
  }
}

// Firebase Firestore => Firestore
export const getUserInfoByUsername = async (username) => {
  const q1 = query(usersRef, where('username', '==', username))
  const userInfo = await getDocs(q1)
    .then(({ docs }) => {
        // console.log(docs[0].data());
        return {
          ...docs[0].data(), 
          id: docs[0].id
        }
    })
    .catch((err) => {
      console.log(err);
    })

  return userInfo
}

export const getMessages = async (conversationID) => {
  const messagesRef = collection(db, 'conversations', conversationID, 'messages')
  const q = query(messagesRef, orderBy('createdAt', 'desc'))
  const allMessages = getDocs(q)
    .then(({ docs }) => {
      let messages = []
      docs.forEach(doc => {
        const time = '0' + doc.data().createdAt.toDate().toLocaleTimeString()
        const newTime = formatTime(time)
        // console.log('messages', doc.data())
        messages.push({ ...doc.data(), id: doc.id, createdAt: newTime})
      })
      return messages
    })
  return allMessages
}

export const getConversations = async (username) => {
  // Conversations for current user
  const q1 = query(chatRef, where('members', 'array-contains', username))
  const conversations = await getDocs(q1)
  .then(({ docs }) => {
      let convos = []
      docs.forEach(doc => {
        convos.push({ ...doc.data(), id: doc.id})
      })
      return convos
    })

    return conversations
}

export const getAllConversations = async (username) => {
  // Conversations + messages for current user
  let responses = []
  const conversations = await getConversations(username)
  
  for (const conversation of conversations){
    const { members } = conversation
    const messages = await getMessages(conversation.id)
    let recipients = []
    let status 
    for await(const member of members){
      if(member !== username){
        const userInfo = await getUserInfoByUsername(member)
        status = userInfo.status ? userInfo.status : ''
        if(userInfo && userInfo.displayName){
          recipients.push({name: userInfo.displayName, status})
        }
        else {
          recipients.push({name: member})
        }
      }
    }
    responses.push({...conversation, messages, recipients})
  }
  return responses
}

export const sendMessage = async (conversationID, message, from, to) => {
  // from is current user who is sending message
  console.log(conversationID, message, from, to)
  const messagesRef = collection(db, 'conversations', conversationID, 'messages')
  await addDoc(messagesRef, {
    message,
    from,
    createdAt: serverTimestamp()
  })

  if(from === to || !to){
    console.log(!to);
    console.log(from === to);
    const newConversations = await getAllConversations(from)
    return newConversations
  }

  else{
    const newConversations = await getAllConversations(to)
    return newConversations
  }
}

export const removeMessage = async (conversationID, messageID, from) => {

  const messagesRef = collection(db, 'conversations', conversationID, 'messages')
  const messageRef = doc(messagesRef, messageID)
  await deleteDoc(messageRef)
  const newConversations = await getAllConversations(from)
  return newConversations
}

export const getConversation = async (user, anotherUser) => {
  // Single conversation between current user and another user
  const members = [user, anotherUser]
  const q1 = query(chatRef, where('members', 'array-contains', user))
  const conversation = await getDocs(q1)
  .then(({ docs }) => {
      let convos = []
      docs.forEach(doc => {
        const conversations = doc.data().members
        const success = members.every((val) => {
          return conversations.includes(val)
        })
        
        if(success){
          convos.push({ ...doc.data(), id: doc.id})
        }
      })
      return convos[0]
    })
  return conversation
}

export const addConversation = async (sender, recipient) => {
  const response = await checkUsername(recipient)
  console.log(response);
  if(!response){
    return {
      error: 'User not found!'
    }
  }
  const existingConversation = await getConversation(sender, recipient)
  const newConversations = await getAllConversations(sender)
  if(existingConversation){
  return { 
    conversations: newConversations, 
    conversation: existingConversation}

  }
  else {
    await addDoc(chatRef, {
      members: [sender, recipient]
    }).then((res) => {
      console.log('response', res.data());
    })

    const newConversations = await getAllConversations(sender)
    const newConversation = newConversations.filter(convo => {
      return convo.members.includes(sender && recipient)
    })
    
    return {
      conversations : newConversations,
      conversation: newConversation
    }
  }
}

export const sendFriendRequest = async (sender, recipient) => {
  const userInfo = await getUserInfoByUsername(recipient)
  
  if(!userInfo.friendRequests ||  !userInfo.friendRequests.includes(sender)){
    const docRef = doc(usersRef, userInfo.id)
    await updateDoc(docRef, {
      friendRequests: arrayUnion(sender)
    })
    return 'Friend request sent'
  }
  else {
    return 'Friend request still exist'
  }
}

export const removeFriend = async (user, friend) => {
  // Current user
  const userInfo = await getUserInfoByUsername(user)
  const userRef = doc(usersRef, userInfo.id)
  // 
  const targetUserInfo = await getUserInfoByUsername(friend)
  const targetUserRef = doc(usersRef, targetUserInfo.id)
  await updateDoc(userRef, {
    friends: arrayRemove(friend)
  })
  await updateDoc(targetUserRef, {
    friends: arrayRemove(user)
  })

  const newUserInfo = await getUserInfoByUsername(user)

  return newUserInfo
}

export const handleFriendRequest = async (action, user, username) => {
  // Current user received a friend request from target user
  // Current user
  console.log(user, action, username);
  const userInfo = await getUserInfoByUsername(user)
  console.log(userInfo);
  const userRef = doc(usersRef, userInfo.id)
  // Target user
  const targetUserInfo = await getUserInfoByUsername(username)
  console.log(targetUserInfo);
  const targetUserRef = doc(usersRef, targetUserInfo.id)

  await updateDoc(userRef, {
    friendRequests: arrayRemove(username),
  })

  let newUserInfo = await getUserInfoByUsername(user)
  
  if(action === 'accept'){
    console.log('wait');
    await updateDoc(targetUserRef, {
      friends: arrayUnion(user)
    })
    await updateDoc(userRef, {
      friends: arrayUnion(username)
    })
    
    newUserInfo = await getUserInfoByUsername(user)
    return newUserInfo
  }
  return newUserInfo
}

export const queryTest = async (username) => {
  const userInfo = await getUserInfoByUsername(username)
  const userRef = doc(usersRef, userInfo.id)

  await updateDoc(userRef, {
    displayName: 'Andrew'
  })

  const newUserInfo = await getUserInfoByUsername(username)
  console.log(newUserInfo);
  return newUserInfo
}


export const updateUserProfile = async (username, query, data) => {
  const userInfo = await getUserInfoByUsername(username)
  const userRef = doc(usersRef, userInfo.id)

  if(query === 'displayName'){
    await updateDoc(userRef, {
      displayName: data
    })
  }

  if(query === 'status'){
    await updateDoc(userRef, {
      status: data
    })
  }

  const newUserInfo = await getUserInfoByUsername(username)
  return newUserInfo
}

export const welcomeMessage = async (username) => {
  const newConversation = await addConversation('chandrew', username)
  const { conversation } = newConversation
  const newConversations = await sendMessage(conversation.id, `Hi ${username}, Welcome to Accord!`, 'chandrew')
  return newConversations
}