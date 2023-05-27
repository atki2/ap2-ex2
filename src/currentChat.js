function CurrentChat({ image, name }) {
  return (
    <div>
      <img
        src={"data:image/png;base64, " + image}
        width={30}
        height={25}
        className="empty rounded-circle profilePhoto"
      />
      {name}
    </div>
  );
}

export default CurrentChat;