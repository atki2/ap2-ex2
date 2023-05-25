function ContactItem(contact) {
  return (
    <div>
      <span className="float-left contact-friend">
        <img
          src={contact.image}
          width={30}
          height={25}
          className="empty rounded-circle profilePhoto"
        />
        {contact.displayName}
      </span>
      <small className="text-muted float-right">{contact.id} {contact.date}, {contact.hour}, {contact.lastMessage}</small>
    </div>
  );
}

export default ContactItem;