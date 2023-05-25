import './csss/chats.css'
import ChatOwner from './chatOwner';
import CurrentChat from './currentChat';
import MessageItem from './messageItem'
import ContactItem from './ContactItem';
import addcontact from './pictures/addcontact.png'
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { serverAddChat, serverGetContactList, serverGetCserverGetContactList, serverGetMessages, serverGetToken, serverRegisterAccount, serverSendMessage } from './operations';
import empty from './pictures/empty.png'

var selectContact = false;
var currentContacts = [];
var currentMessages = [];
function Chats({ username, displayName, picture, token }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [isClose, setIsClose] = useState(true);

  const closeAlert = function () {
    setIsClose(true);
  }

  function myAlert(errorMsgParam) {
    setErrorMsg(errorMsgParam);
    setIsClose(false);
  }
  const location = useLocation();
  const navigate = useNavigate();
  const logOut = function () {
    currentMessages = [];
    selectContact = false;
    navigate("/");
  }


  // var { username, displayName, picture } = location.state;

  const messageList = currentMessages.map((message, key) => {
    return <MessageItem {...message} key={key} />
  });

  const [currentChatDisplayName, setDisplayName] = useState("Select contact to chat with");
  const [currentChatImageUrl, setImageUrl] = useState(empty);
  const [currentChatUsername, setCurrentChatUsername] = useState('');
  const [currentMessagesList, setCurrentMessagesList] = useState(messageList);
  const [dinamicContactList, setDinamicContactList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(0)
  useEffect(() => {
    // console.log("in use effect")
    const initContacts = async () => {
      currentContacts = await serverGetContactList(token);
      const contactList = currentContacts.map((contact, key) => {
        return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
      });

      // console.log("whaaaaaaaaaa")
      // console.log("contact listssssssssssssssssssssss: " + JSON.stringify(contactList))
      setDinamicContactList(contactList)
    };

    initContacts();
  }, []);


  // const token1 = serverGetToken("a", "a");
  // console.log("token:" + token1)
  // serverSendMessage(token, 2, "lastMsg")
  // console.log("resulttt: " + JSON.stringify(serverGetMessages(token, 2, "a")));
  // serverAddChat(token, "a")
  // serverRegisterAccount("ytytytytyffffffffggsssssssssss", "iojsijosioj", "sksks", "pic")

  const changeChat = async function (contact) {
    selectContact = true;
    setDisplayName(contact.displayName);
    setImageUrl(contact.image);
    setCurrentChatUsername(contact.username);
    setCurrentChatId(contact.id)
    currentMessages = await serverGetMessages(token, contact.id, contact.username);
    // console.log(JSON.stringify(currentMessages))
    setCurrentMessagesList(currentMessages.map((message, key) => {
      return <MessageItem {...message} key={key} />
    }));
    // console.log(currentMessagesList)
  }

  const sendMessage = async function () {
    if (!selectContact) {
      return;
    }
    const message_input = document.getElementById('textBox');
    if (await serverSendMessage(token, currentChatId, message_input.value.trim()) === false) {
      console.log("error")
    }
    // //message user sent
    // addMessage(username, currentChatUsername, message_input.value.trim(), currentTime, "me");
    // // message other user recieved
    // addMessage(currentChatUsername, username, message_input.value.trim(), currentTime, "other");
    // console.log("currentChatUsername: " + currentChatUsername)
    currentMessages = await serverGetMessages(token, currentChatId, currentChatUsername);
    // console.log("currentMessages: " + JSON.stringify(currentMessages))
    setCurrentMessagesList(currentMessages.map((message, key) => {
      return <MessageItem {...message} key={key} />
    }));
    // console.log(currentMessagesList)
    currentContacts = await serverGetContactList(token);
    const contactList = currentContacts.map((contact, key) => {
      return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    });

    setDinamicContactList(contactList)

    // console.log(currentMessages);
    // setCurrentMessagesList(currentMessages.map((message, key) => {
    //   return <MessageItem {...message} key={key} />
    // }));
    // const day = now.getDate().toString().padStart(2, '0');
    // const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // const year = now.getFullYear().toString();
    // const date = `${day}/${month}/${year}`;
    // //change contact date and hour
    // const changeDateContact = { userName: currentChatUsername, displayName: currentChatDisplayName, image: currentChatImageUrl, date: date, hour: currentTime };
    // changeContact(username, currentChatUsername, changeDateContact);
    // //make sender the contact of the reciever
    // addContact(currentChatUsername, username, displayName, picture.imageUrl, date, currentTime);
    // currentContacts = getContacts(username);
    // setDinamicContactList(currentContacts.map((contact, key) => {
    //   return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    // }));
  }

  const chatsAddContact = async function () {
    const contact_input = document.getElementById('newContact');
    const contactUsername = contact_input.value;
    console.log(contactUsername)
    const errorMsg = await serverAddChat(token, contactUsername)
    if (!(errorMsg === "")) {
      myAlert(errorMsg)
      return;
    }

    setIsClose(true);
    // addContact(username, contactUsername, getDisplayName(contactUsername), getProfilePhoto(contactUsername).imageUrl, 'No last date', 'No last hour');
    currentContacts = await serverGetContactList(token);
    setDinamicContactList(currentContacts.map((contact, key) => {
      return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    }));
  }

  return (
    <div id="chats">

      <div className="d-flex justify-content-end">
        <button href="login.html" className="chats btn btn-danger sm mt-2 mr-2" onClick={logOut}>
          logout
        </button>
      </div>
      <div className="chats container" id="chatBox">
        <div className="chats row">
          <div className="chats col-4" id="me">
            <div className="chats button-container name">
              <div>
                <ChatOwner image={picture.imageUrl} name={displayName} />
                <button
                  className="chats btn btn-sm btn-primary empty rounded-circle"
                  data-toggle="modal"
                  data-target="#myModal"
                  id="addContact"
                >
                  <img src={addcontact} width={20} height={20} />
                  <span />
                </button>
              </div>
            </div>
          </div>
          <div className="chats name col-8">
            <CurrentChat image={currentChatImageUrl} name={currentChatDisplayName} />
          </div>
        </div>
        <div className="chats row">
          <div className="chats col-4 no-gutters">
            <div
              className="chats list-group list-group-flush scrollbar scrollbar-blue"
              style={{ position: "relative", overflowY: "scroll", height: 400 }}
            >
              {dinamicContactList}
            </div>
          </div>
          <div className="chats col-8 scrollbar scrollbar-green" id="messages">
            {messageList}
          </div>
        </div>
        <div className="chats row">
          <div className="chats col-4" />
          <div className="chats col-8 no-gutters">
            <button type="button" className="chats btn btn-primary" id="sendButton" onClick={() => sendMessage()}>
              send
            </button>
            <input
              type="text"
              id="textBox"
              className="chats form-control"
              placeholder="Enter text"
            />
          </div>
        </div>
      </div>
      {/* modal - add contact */}
      <div
        className="chats modal fade" id="myModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
        <div className="chats modal-dialog" role="document">
          <div className="chats modal-content">
            <div className="chats modal-header">
              <h4 className="chats modal-title" id="myModalLabel">Add new contact:</h4>
              <button type="button" className="chats close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="chats modal-body">
              {!isClose && (<div class="alert alert-danger alert-dismissible show" role="alert">
                {errorMsg}
                <button type="button" class="close" onClick={closeAlert}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>)}
              <form>
                <div className="chats form-group">
                  <input type="text" className="chats form-control" id="newContact" />
                </div>
              </form>
            </div>
            <div className="chats modal-footer">
              <button type="button" className="chats btn btn-default" data-dismiss="modal">
                Close
              </button>
              <button type="button" className="chats btn btn-primary" onClick={chatsAddContact}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal  */}
    </div>
  );
}

export default Chats;
