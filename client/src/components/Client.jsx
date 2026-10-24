
const Client = ({ username, isCurrentUser }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 place-items-center rounded-lg font-bold"
        style={{ background: '#405FFA', color: '#D9FCED', boxShadow: '0 2px 10px rgba(64,95,250,0.35)' }}>
        {username.charAt(0).toUpperCase()}
      </div>

      <div>
        <p className="text-sm font-semibold" style={{ color: '#D9FCED' }}>
          {username}
        </p>
        <p className="text-xs" style={{ color: isCurrentUser ? '#09BBC8' : 'rgba(217,252,237,0.4)' }}>
          {isCurrentUser ? "You" : "User"}
        </p>
      </div>
    </div>
  );
};

export default Client;
