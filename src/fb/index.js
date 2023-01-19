// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { 
  getFirestore, collection, 
  doc, 
  getDocs, 
  // getDoc, 
  addDoc, query, where, orderBy, serverTimestamp, deleteDoc, onSnapshot, getDoc, updateDoc, arrayUnion, arrayRemove 
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
          username,
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
  const q1 = query(usersRef, where('username', '==', username))
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
  const q1 = query(usersRef, where('authID', '==', authID))
  const userInfo = await getDocs(q1)
    .then(({ docs }) => {
        console.log(docs[0].data());
        return {
          ...docs[0].data(), 
          id: docs[0].id
        }
    })

  return userInfo
}

// Firebase Firestore => Firestore
export const getUserInfoByUsername = async (username) => {
  const q1 = query(usersRef, where('username', '==', username))
  const userInfo = await getDocs(q1)
    .then(({ docs }) => {
        console.log(docs[0].data());
        return {
          ...docs[0].data(), 
          id: docs[0].id
        }
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
  for(const conversation of conversations){
    const messages = await getMessages(conversation.id)
    responses.push({...conversation, messages})
  }
  return responses
}

export const sendMessage = async (conversationID, message, from) => {
  // from is current user who is sending message
  const messagesRef = collection(db, 'conversations', conversationID, 'messages')
  await addDoc(messagesRef, {
    message,
    from,
    createdAt: serverTimestamp()
  })
  const newConversations = await getAllConversations(from)
  return newConversations
}

export const removeMessage = async (conversationID, messageID, from) => {

  const messagesRef = collection(db, 'conversations', conversationID, 'messages')
  const messageRef = doc(messagesRef, messageID)
  await deleteDoc(messageRef)
  const newConversations = await getAllConversations(from)
  return newConversations
}

export const getConversation = async (user, member) => {
  // Single conversation between current user and another user
  // from is current user 
  // 
  const q1 = query(chatRef, where('members', 'array-contains', (user, member)))
  const conversation = await getDocs(q1)
  .then(({ docs }) => {
      let convos = []
      docs.forEach(doc => {
        convos.push({ ...doc.data(), id: doc.id})
      })
      return convos
    })
  return conversation
}

export const addConversation = async (sender, recipient) => {
  console.log(recipient);
  const response = await checkUsername(recipient)
  if(!response){
    return {
      error: 'User not found!'
    }
  }
  const existingConversation = await getConversation(sender, recipient)
  const newConversations = await getAllConversations(sender)
  if(existingConversation.length > 0){
  return { 
    conversations: newConversations, 
    conversation: existingConversation}

  }
  else {
    await addDoc(chatRef, {
      members: [sender, recipient]
    }).then((res) => {
      console.log('response', res);
      return res
    })
    const newConversations = await getAllConversations(sender)
    const newConversation = newConversations.filter(convo => {
      return convo.members.includes(sender && recipient)
    })
    console.log(newConversation);
    console.log(newConversations);
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

  return 'Friend removed'
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
  console.log('me too?');
  return newUserInfo
}

export const queryTest = async (user, username) => {

}