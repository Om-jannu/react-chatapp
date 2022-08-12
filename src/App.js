import React, { useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import beachvdo from './component/video/beachvideo.mp4';
import {FaGoogle} from "react-icons";

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
  measurementId: "G-BS577HD9J9",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header>
        <Signout />
      </header>
      <section>{user ? <Chatroom /> : <Signin />}</section>
    </div>
  );
};

const Chatroom = () => {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behaviour: "smooth" });
  };

  return (
    <div>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img alt={auth.currentUser.displayName} src={photoURL} />
      <p>{text}</p>
    </div>
  );
};

const Signin = () => {
  const signInWithGoogle = () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    } catch (error) {
      alert(error);
    }
  };
  const signInWithFacebook = () => {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      auth.signInWithPopup(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="signinPage">
      <video autoPlay loop muted>
        <source src={beachvdo} type="video/mp4"/>
      </video>
      
      <main>
          <div className="signInContent">
            <h1>Alohaass</h1>
            <p><img src="./images/grouppeople.png" alt="group of people logo" /><p>Group Chat Application <br /> to have fun with friends 😉</p></p>
            <button className="signInButton" onClick={signInWithGoogle}><img src="./images/google.png" alt="google logo" /><p>Google</p>
            </button>
            <button className="signInButton" onClick={signInWithFacebook}><img src="./images/facebook.png" alt="facebook logo" /><p>Facebook</p>
            </button>
          </div>
          <section>
          <img src="./images/chatHeroImage.png" alt="chat hero image" />
        </section>
      </main>
        
    </div>
  );
};

const Signout = () => {
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
};

export default App;
