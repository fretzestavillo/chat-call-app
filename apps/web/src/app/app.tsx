import Login from './authentication/login';
import SignUp from './authentication/signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateChat } from './Chat/private.chat';
import { GroupChat } from './Chat/group.chat';
import { Home } from './Chat/home.chat';
import { VideoCall } from './Chat/videoCall';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/PrivateChat" element={<PrivateChat />} />
        <Route path="/GroupChat" element={<GroupChat />} />
        <Route path="/VideoCall" element={<VideoCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
