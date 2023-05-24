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
      <small className="text-muted float-right">{contact.date}, {contact.hour}</small>
    </div>
  );
}

export default ContactItem;