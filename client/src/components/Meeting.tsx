import './Meeting.scss';
import React, { FC, useEffect, useCallback, useRef } from 'react';
import Video from 'twilio-video';
import { nanoid } from 'nanoid';
import Spinner from 'react-bootstrap/Spinner';

import useAPI from '../hooks/useAPI';
import useQuery from '../hooks/useQuery';
import { useDispatch, useSelector, actions } from '../store';

const Meeting: FC = () => {
  const dispatch = useDispatch();
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const localAudio = useRef<HTMLAudioElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const remoteAudio = useRef<HTMLAudioElement | null>(null);
  const { token } = useSelector((state) => state.twilio);
  const { query, setQuery } = useQuery();
  const { getTwilioToken } = useAPI();

  const onConnect = useCallback((participant: Video.RemoteParticipant) => {
    participant.on('trackSubscribed', (track) => {
      if (track.kind === 'video') {
        const t: Video.RemoteVideoTrack = track;

        if (remoteVideo.current) t.attach(remoteVideo.current);
      } else if (track.kind === 'audio') {
        const t: Video.RemoteAudioTrack = track;

        if (remoteAudio.current) t.attach(remoteAudio.current);
      }
    });

    participant.on('trackUnsubscribed', (track) => {
      if (track.kind === 'video') {
        const t: Video.RemoteVideoTrack = track;

        t.detach();
      } else if (track.kind === 'audio') {
        const t: Video.RemoteAudioTrack = track;

        t.detach();
      }
    });
  }, []);

  useEffect(() => {
    if (token) return;

    if (!query.room) {
      setQuery({ room: nanoid() });

      return;
    }

    getTwilioToken(query.room);
  }, [getTwilioToken, setQuery, query.room, token]);

  useEffect(() => {
    if (!token) return;

    let room: Video.Room | null = null;

    Video.connect(token, {
      name: query.room
    }).then((r) => {
      if (!token) return;

      room = r;

      const localAudioTrack = Array.from(room.localParticipant.audioTracks.values())[0];
      const localVideoTrack = Array.from(room.localParticipant.videoTracks.values())[0];

      if (localAudio.current) localAudioTrack.track?.attach(localAudio.current);
      if (localVideo.current) localVideoTrack.track?.attach(localVideo.current);

      const participants = Array.from(room.participants.values());

      if (participants.length) onConnect(participants[0]);

      room.on('participantConnected', onConnect);
    });

    return () => {
      if (room) {
        room.disconnect();

        room.removeAllListeners();
      }

      dispatch(actions.set({ twilio: { token: '' } }));
    };
  }, [query.room, token, onConnect, dispatch]);

  return (
    <div className="Meeting">
      <div className="local">
        <video ref={localVideo} autoPlay={true} />
        <audio ref={localAudio} autoPlay={true} />
        <Spinner animation="border" />
      </div>
      <div className="remote">
        <video ref={remoteVideo} autoPlay={true} />
        <audio ref={remoteAudio} autoPlay={true} />
        <Spinner animation="border" />
      </div>
    </div>
  );
};

export default Meeting;