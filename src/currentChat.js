function CurrentChat({ image, name }) {
  return (
    <div>
      <img
        src={image}
        width={30}
        height={25}
        className="empty rounded-circle profilePhoto"
      />
      {name}
    </div>
  );
}

export default CurrentChat;