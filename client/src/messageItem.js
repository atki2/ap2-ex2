function MessageItem(chat) {
  const myMessage =
    <div className="messageArea">
      <div className="badge badge-success container my message">
        <div>
          {chat.content}
        </div>
        <span className="badge badge-pill date">{chat.hour}</span>
      </div>
    </div>

  const otherMessage =
    <div className="messageArea">
      <div className="badge badge-secondary container other message">
        <div>
          {chat.content}
        </div>
        <span className="badge badge-pill date">{chat.hour}</span>
      </div>
    </div>

  if (chat.who === "me") {
    return (myMessage);
  }

  return (otherMessage);

}

export default MessageItem;