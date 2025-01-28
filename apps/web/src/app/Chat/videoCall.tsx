import { useLocation } from 'react-router-dom';
import './tools/style.css';
import { WebsocketContext } from './socket';

import { useContext, useEffect, useRef, useState } from 'react';
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  setDoc,
  getDoc,
} from 'firebase/firestore';

import { firebaseConfig } from './tools/config';
import { initializeApp } from 'firebase/app';

export function VideoCall() {
  const location = useLocation();

  const privatesender = location.state.privatesender;
  const privaterecipient = location.state.privaterecipient;
  const privateCallId = location.state.caller?.callId;

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const socket = useContext(WebsocketContext);

  const [pc] = useState(() => new RTCPeerConnection(servers));

  const webcamVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const [callId, setCallId] = useState<string>('');

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [webcamIsDisabled, setWebcamIsDisabled] = useState(false);
  const [callButtonIsDisabled, setCallButtonIsDisabled] = useState(true);
  const [answerButtonIsDisabled, setAnswerButtonIsDisabled] = useState(true);
  const [hangoutButtonIsDisabled, sethangoutButtonIsDisabled] = useState(false);

  useEffect(() => {
    if (webcamVideo.current && localStream) {
      webcamVideo.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideo.current && remoteStream) {
      remoteVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  async function webcamButton() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      setRemoteStream(new MediaStream());

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        const newStream = event.streams[0];
        if (newStream) {
          setRemoteStream((prevStream) => {
            const updatedStream = new MediaStream([
              ...(prevStream ? prevStream.getTracks() : []),
              ...newStream.getTracks(),
            ]);
            return updatedStream;
          });
        }
      };
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }

    setWebcamIsDisabled(true);
    setCallButtonIsDisabled(false);
    setAnswerButtonIsDisabled(false);
  }

  async function callButton() {
    const callDocRef = doc(collection(firestore, 'calls'));
    setCallId(callDocRef.id);

    socket.emit('private_call_id', {
      sender: privatesender,
      recipient: privaterecipient,
      callId: callDocRef.id,
    });

    const offerCandidatesRef = collection(callDocRef, 'offerCandidates');
    const answerCandidatesRef = collection(callDocRef, 'answerCandidates');

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          await addDoc(offerCandidatesRef, event.candidate.toJSON());
        } catch (error) {
          console.error('Error adding candidate: ', error);
        }
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDocRef, { offer });

    onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !pc.currentRemoteDescription) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidatesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidateData = change.doc.data();
          const candidate = new RTCIceCandidate(candidateData);
          pc.addIceCandidate(candidate);
        }
      });
    });

    sethangoutButtonIsDisabled(true);
  }

  async function answerButton() {
    console.log(privateCallId);
    const callDoc = doc(firestore, 'calls', privateCallId);

    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    try {
      const callDocSnapshot = await getDoc(callDoc);
      const callData = callDocSnapshot.data();

      if (!callData) {
        console.error('No call data found!');
        return;
      }

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    } catch (error) {
      console.error('Error during the answer process:', error);
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCallId(event.target.value);
  };

  return (
    <div>
      <h2> Start your Webcam</h2>
      <div className="videos">
        <span>
          <video ref={webcamVideo} autoPlay playsInline></video>
        </span>
        <span>
          <video ref={remoteVideo} autoPlay playsInline></video>
        </span>
      </div>

      <button onClick={webcamButton} disabled={webcamIsDisabled}>
        Start webcam
      </button>
      <h2>2. Create a new Call</h2>
      <button onClick={callButton} disabled={callButtonIsDisabled}>
        Create Call (offer)
      </button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>

      <input
        type="text"
        value={callId}
        placeholder="Enter call ID"
        onChange={handleInputChange}
      />
      <button onClick={answerButton} disabled={answerButtonIsDisabled}>
        Answer
      </button>

      <h2>4. Hangup</h2>

      <button disabled={hangoutButtonIsDisabled}>Hangup</button>
    </div>
  );
}
