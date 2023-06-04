import Chats from'./Chats'
import Login from './Login'
import { useLocation } from 'react-router-dom';

function ChatsGateway(){
    const location = useLocation();
    if (!location.state) {
        return(<Login />);
    }
    
    const { username, displayName, picture, token } = location.state;
    return <Chats username={username} displayName={displayName} picture={picture} token={token}/>;
}

export default ChatsGateway;