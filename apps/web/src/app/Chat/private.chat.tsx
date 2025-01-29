import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from './socket';
import { CallerItem, Item, PrivateContent } from './tools/type';
import '../../styles.css';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
export function PrivateChat() {
  const location = useLocation();
  const FromLOgindata = location.state;

  const privatesender = FromLOgindata.FromLOgindata.result.name;
  const privaterecipient = FromLOgindata.recipient;

  const token = FromLOgindata.FromLOgindata.result.access_token;
  const socket = useContext(WebsocketContext);
  const [newMessage, setNewMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState<PrivateContent[]>([]);
  const navigate = useNavigate();
  const [caller, setCaller] = useState<CallerItem>();

  useEffect(() => {
    getList();
  }, []);

  const getList = async (): Promise<void> => {
    const senderfromhome = privatesender;
    const recipientfromhome = privaterecipient;
    const BaseUrl = 'http://localhost:3000/api/';
    const response = await fetch(
      `${BaseUrl}privatechat?sender=${senderfromhome}&recipient=${recipientfromhome}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const result = await response.json();
    setPrivateMessage(result);
  };

  useEffect(() => {
    socket.on('private_message', (newMessage: PrivateContent) => {
      setPrivateMessage((prev) => [...prev, newMessage]);
    });
    socket.on('private_caller_id', (data: CallerItem) => {
      setCaller(data);
    });

    return () => {
      console.log('Unregistering Events...');
      socket.off('private_chat');
      socket.off('private_message');
      socket.off('private_caller_id');
    };
  }, []);

  function onSubmit() {
    const sender = privatesender;
    const recipient = privaterecipient;
    const messageContent = newMessage;

    socket.emit('private_chat', {
      sender: sender,
      recipient: recipient,
      messageContent: messageContent,
    });

    setNewMessage('');
  }

  function videoCall() {
    navigate('/VideoCall', { state: { privatesender, privaterecipient } });
  }

  return (
    <>
      <div>
        <div>
          <h1>
            {' '}
            {caller?.sender ? (
              <Stack
                onClick={() => {
                  navigate('/VideoCall', { state: { caller } });
                }}
                sx={{ width: '95%', cursor: 'pointer' }}
                spacing={2}
              >
                <Alert variant="filled" severity="success">
                  {caller?.sender} is calling.
                </Alert>
              </Stack>
            ) : (
              console.log()
            )}
            Welcome to private chat {privatesender},wanna start conversation
            with {privaterecipient} ? or call {privaterecipient} now{' '}
            <button onClick={videoCall}>Video call </button>
          </h1>

          <br />
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

      <div>
        {privateMessage.map((data, index) => (
          <div key={index}>
            <p>
              {data.sender}: {data.messageContent} &nbsp;{' '}
              {new Date(data.created_at).toLocaleString(undefined, {
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
    </>
  );
}
