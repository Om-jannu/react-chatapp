import React, { useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import beachvdo from "./component/video/beachvideo.mp4";
import { FaGoogle } from "react-icons";

// firebase hooks start

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect } from "react";

// firebase hooks ends
firebase.initializeApp({
  apiKey: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTHDOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APPID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENTID}`,
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <section>{user ? <Chatroom /> : <Signin />}</section>
      {/* <section><Chatroom/></section> */}
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
    dummy.current.scrollIntoView({behaviour : 'smooth'});
  };

  return (
    <div className="chatRoom">
      <video autoPlay loop muted>
        <source src={beachvdo} type="video/mp4" />
      </video>
      <div className="chatMessageSection">
        <div className="chatroomHeader">
          <div className="chatroomHead">
            <img src="./images/grouppeople.png" alt="group of people logo" />
            <h1>Alohaass</h1>
          </div>
          <p>Don't Forget to Sign Out after you are Done Chatting</p>
          <Signout />
        </div>
        <div className="chatroomContainer">
          <div className="messagebox">
            {messages &&
              messages.map((msg) => <ChatMessage  key={msg.id} message={msg} />)}
          </div>
          <span ref={dummy}></span>
          <div className="inputbox">
            <form onSubmit={sendMessage}>
              <input
              placeholder="write something"
                value={formValue}
                onChange={(e) => {
                  setFormValue(e.target.value);
                }}
              />
              <button type="submit" disabled={!formValue}><img src="./images/paper-plane.png" alt="paperplane"/></button>
            </form>
          </div>
        </div>
      </div>
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
        <source src={beachvdo} type="video/mp4" />
      </video>

      <main>
        <div className="signInContent">
          <h1>Alohaass</h1>
          <div className="signInDesc">
            <img src="./images/grouppeople.png" alt="group of people logo" />
            <p>Group Chat Application</p>
          </div>
          <button className="signInButton" onClick={signInWithGoogle}>
            <img src="./images/google.png" alt="google logo" />
            <p>Google</p>
          </button>
          <button className="signInButton" onClick={signInWithFacebook}>
            <img src="./images/facebook.png" alt="facebook logo" />
            <p>Facebook</p>
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
      <button className="logoutbtn"
        onClick={() => {
          auth.signOut();
        }}
      >
        <p>Sign Out</p>
        <img src="./images/logout.png" alt="logout" />
      </button>
    )
  );
};

export default App;
