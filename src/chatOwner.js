function ChatOwner({ image, name }) {
  return (
    <span className="float-left" style={{ marginLeft: "1%" }}>
      <img
        src={"data:image/png;base64, " + image}
        width={30}
        height={25}
        className="empty rounded-circle profilePhoto"
      />
      {name}
    </span>
  );
}

export default ChatOwner;