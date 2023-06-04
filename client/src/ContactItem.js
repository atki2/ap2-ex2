function ContactItem(contact) {
  return (
    <div>
      <span className="float-left contact-friend">
        <img
          src={"data:image/png;base64, " + contact.image}
          width={30}
          height={25}
          className="empty rounded-circle profilePhoto"
        />
        {contact.displayName}
      </span>
      <small className="text-muted float-right">{contact.date}, {contact.hour}, {contact.lastMessage}</small>
    </div>
  );
}

export default ContactItem;