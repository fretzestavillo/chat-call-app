import { useLocation, useNavigate } from 'react-router-dom';
import { Inputs, MessageList } from './tools/type';
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from './socket';

export function GroupChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const FromLOgindata = location.state;
  const myName = FromLOgindata.FromLOgindata.result.name;
  const token = FromLOgindata.FromLOgindata.result.access_token;
  const [messages, setMessages] = useState<MessageList[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    getList();
  }, []);
  const getList = async (): Promise<void> => {
    const BaseUrl = 'http://localhost:3000/api/';
    // const response = await fetch(`${BaseUrl}chat`);
    const response = await fetch(`${BaseUrl}chat`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token
        'Content-Type': 'application/json', // Optional, but good practice
      },
    });    

    const result = await response.json();
    setMessages(result);
    socket.emit('getOnlineUser', myName);
  };

  useEffect(() => {
    socket.on('messageToClient', (newMessage: MessageList) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      console.log('Unregistering Events...');
      socket.off('messageToServer');
      socket.off('messageToClient');
    };
  }, []);

  const onSubmit = () => {
    !newMessage ? alert('Please put message'): console.log('good boy')
    const data: Inputs = {
      sender: myName,
      message: newMessage,
    };
    socket.emit('messageToServer', data);
    setNewMessage('');
  };

  return (
    <>
      
          <h1>Welcome to the Group Chat {myName} </h1>

          <div>
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <p>
                    {msg.sender}: {msg.message}: &nbsp;{' '}
                    {new Date(msg.created_at).toLocaleString(undefined, {
                      // year: 'numeric',
                      // month: 'long',
                      // day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={onSubmit}>Submit</button>
          </div>
          
          </>
  );
}
