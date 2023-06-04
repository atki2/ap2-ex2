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
import io from 'socket.io-client';


var selectContact = false;
var socket_connected = false;
var currentContacts = [];
var currentMessages = [];
var currentChatId = ""


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



  const messageList = currentMessages.map((message, key) => {
    return <MessageItem {...message} key={key} />
  });

  const [currentChatDisplayName, setDisplayName] = useState("Select contact to chat with");
  const [currentChatImageUrl, setCurrentChatImageUrl] = useState(empty);
  const [currentChatUsername, setCurrentChatUsername] = useState('');
  const [currentMessagesList, setCurrentMessagesList] = useState(messageList);
  const [dinamicContactList, setDinamicContactList] = useState([]);
  useEffect(() => {
    const initContacts = async () => {
      currentContacts = await serverGetContactList(token);
      const contactList = currentContacts.map((contact, key) => {
        return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
      });

      setDinamicContactList(contactList)
    };

    initContacts();
  }, []);

  const changeChat = async function (contact) {
    selectContact = true;
    setDisplayName(contact.displayName);
    setCurrentChatImageUrl(contact.image);
    setCurrentChatUsername(contact.username);
    currentChatId = contact.id
    currentMessages = await serverGetMessages(token, contact.id, contact.username);
    setCurrentMessagesList(currentMessages.map((message, key) => {
      return <MessageItem {...message} key={key} />
    }));
    currentContacts = await serverGetContactList(token);
    const contactList = currentContacts.map((contact, key) => {
      return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    });

    setDinamicContactList(contactList)
  }

  const sendMessage = async function () {
    if (!selectContact) {
      return;
    }
    const message_input = document.getElementById('textBox');
    if (await serverSendMessage(token, currentChatId, message_input.value.trim()) === false) {
      myAlert("error")
    }
    currentMessages = await serverGetMessages(token, currentChatId, currentChatUsername);
    setCurrentMessagesList(currentMessages.map((message, key) => {
      return <MessageItem {...message} key={key} />
    }));
    currentContacts = await serverGetContactList(token);
    const contactList = currentContacts.map((contact, key) => {
      return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    });

    setDinamicContactList(contactList)
  }

  const chatsAddContact = async function () {
    const contact_input = document.getElementById('newContact');
    const contactUsername = contact_input.value;
    const errorMsg = await serverAddChat(token, contactUsername)
    if (!(errorMsg === "")) {
      myAlert(errorMsg)
      return;
    }

    setIsClose(true);
    currentContacts = await serverGetContactList(token);
    setDinamicContactList(currentContacts.map((contact, key) => {
      return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
    }));
  }

  useEffect(() => {
    const socket = io('http://localhost:5001')
    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('username', username);
      socket.on('message', async ({ sender, id }) => {
        currentContacts = await serverGetContactList(token);
        const contactList = currentContacts.map((contact, key) => {
          return <button className="list-group-item btn" onClick={() => changeChat(contact)}><ContactItem {...contact} key={key} /></button>;
        });
        setDinamicContactList(contactList)
        if (id === currentChatId) {
          currentMessages = await serverGetMessages(token, id, sender);
          setCurrentMessagesList(currentMessages.map((message, key) => {
            return <MessageItem {...message} key={key} />
          }));
        }
      })
      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    });
  })


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
                <ChatOwner image={picture} name={displayName} />
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
