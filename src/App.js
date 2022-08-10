import React, { useRef, useState } from "react";
import "./App.css";
import firebase  from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// firebase hooks start

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// firebase hooks ends
firebase.initializeApp({
  apiKey: "AIzaSyCHij4mcPuQhiCSGPvjfbB9wEV0dxD6CQY",
  authDomain: "react-chatapp-cf8c7.firebaseapp.com",
  projectId: "react-chatapp-cf8c7",
  storageBucket: "react-chatapp-cf8c7.appspot.com",
  messagingSenderId: "1069624741086",
  appId: "1:1069624741086:web:5d0b6a2b15bd748956464f",
  measurementId: "G-BS577HD9J9"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
    <header>
      <Signout/>
    </header>
    <section>
    {user ? <Chatroom/> : <Signin/>}
    </section>
    </div>
  )
};

const Chatroom = ()=> {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue,setFormValue] = useState("");
  const dummy = useRef();

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid,photoURL} = auth.currentUser;
    await messageRef.add({
      text:formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({behaviour : 'smooth'});
  }
  
  return (
    <div>
        <main>
        {messages && messages.map( msg => <ChatMessage key={msg.id} message={msg}  />)}
        <div ref={dummy}></div>
        </main>
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=>{
            setFormValue(e.target.value);
          }}/>
          <button type="submit">Send</button>
        </form>
    </div>
  );
}

const ChatMessage =(props) => {

    const {text,uid,photoURL} = props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

const Signin=()=> {
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
return (
  <div>
      <button onClick={signInWithGoogle}>Sign in</button>
  </div>
)
}

const Signout=() => {
  return (
    auth.currentUser && (
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign out
      </button>
    )
  );
}

export default App;
