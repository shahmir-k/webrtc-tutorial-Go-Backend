import { useEffect, useState, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { Phone, SwitchCamera, Columns, Settings, Send, Combine, ArrowDownCircle, Loader2, PictureInPicture2 } from "lucide-react"

import { Container, Body, MainBox, Title, SubTitle, StepBoxContainer, StartButton, Footer, CallStatusBox, OptionButtonBox, CallTitle, CallStatus } from './styles/Call.styles';
import { CALLER } from '../constants/role';
import { Status } from '../types/StepStatus';
import { useWebRTC } from '../hooks/useWebRTC';
import { JOIN, HANG_UP, OFFER, ANSWER, CANDIDATE } from '../constants/messageType';
import { useNavigation } from '../hooks/useNavigation';
import { SIGNALING_URL } from '../constants/endpoint';
import { useWebSocketStore } from '../store/webSocketStore';
import OptionButton from '../components/OptionButton';
import StepBox from '../components/StepBox';
import VideoGroup from '../components/VideoGroup';
import DeviceSettings from '../components/DeviceSettings';



const Call = () => {
    const { handleNavigateToHome, handleNavigateToJoin } = useNavigation(); // Navigations for moving to the Join and Home page

    /**
     * Destructure path variables from the URL:
     * - `name`: the current user's name
     * - `role`: the user's role in the call (either 'caller' or 'callee')
     * - `peer`: the name of the other participant in the call
     */
    const { name, role, peer } = useParams<{ name: string; role: string; peer: string }>();

    // State variables representing each step in the WebRTC peer connection process
    const [videoStepStatus, setVideoStepStatus] = useState<Status>('active');
    const [sendingSdpStepStatus, setSendingSdpStepStatus] = useState<Status>('inactive');
    const [waitingSdpStepStatus, setWaitingSdpStepStatus] = useState<Status>('inactive');
    const [candidateStepStatus, setCandidateStepStatus] = useState<Status>('inactive');

    const [waitingSdpStepLoading, setWaitingSdpStepLoading] = useState<boolean>(false); // Indicates whether the client is currently waiting to receive the peer's SDP offer or answer

    const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null); // The created or received SDP offer
    const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null); // The created or received SDP Answer
    const [iceCandidates, setIceCandidates] = useState<RTCIceCandidate[]>([]); // The ICE candidates received from the remote peer 

    const [videoGroupCallDisplay, setVideoGroupCallDisplay] = useState<boolean>(false); // Whether to show the video call view after the peer connection is successfully established
    const [defaultMode, setDefaultMode] = useState<boolean>(true); // Video call view layout mode toggle
    const [defaultOrder, setDefaultOrder] = useState<boolean>(true); // Video call view layout order toggle
    const [deviceSettingsDisplay, setDeviceSettingsDisplay] = useState<boolean>(false); // Whether to show the device settings modal (camera/microphone selection)

    const {
        disconnect: webSocketDisconnect,
        connect: webSocketConnect,
        send: webSocketSend,
        isConnected: webSocketIsConnected,
        setOnMessage: webSocketSetOnMessage
    } = useWebSocketStore.getState();  // WebSocket managed by Zustand

    const {
        localVideoStream,
        remoteVideoStream,

        audioDevices,
        videoDevices,
        selectedAudioDeviceId,
        selectedVideoDeviceId,
        switchDevices,

        startCreatingLocalStream,
        creatinglocalStreamLoading,
        completeCreatingLocalStream,

        startCreatignOffer,
        creatingOfferLoading,
        completeCreatingOffer,

        startAcceptingOffer,
        acceptingOfferLoading,
        comleteAcceptingOffer,

        startCreatingAnswer,
        creatingAnswerLoading,
        completeCreatingAnswer,

        startAcceptingAnswer,
        acceptingAnswerLoading,
        comleteAcceptingAnswer,

        gatheringIceCandidateLoading,
        iceCandidate,
        completeIceCandidateExchange,
        addIceCandidate,
    } = useWebRTC(); // Custom hook that handles all WebRTC operations including peer connection setup


    /**
     * Checks local stream setup completion and progresses to the next signaling step
     * - If the user is the caller, activate offer creation step
     * - If the user is the callee, wait for offer or activate answer setup if offer is already received
     */
    useEffect(function checkLocalStream() {
        if (completeCreatingLocalStream) {
            setVideoStepStatus('done')

            if (role === CALLER) {
                setSendingSdpStepStatus('active');
            } else {
                if (!offer) {
                    setWaitingSdpStepLoading(true);
                } else {
                    setWaitingSdpStepLoading(false);
                    setWaitingSdpStepStatus('active');
                }
            }
        }

    }, [completeCreatingLocalStream, offer, role])


    /**
     * Handles Setting the local or received offer
     */
    const handleSetOffer = (offer: RTCSessionDescriptionInit) => {
        setOffer(offer);
    }

    /**
     * Handles creating an offer
     */
    const handleCreateOffer = () => {
        startCreatignOffer(handleSetOffer);
    }

    /**
     * Sends the offer to the peer(callee) after successfully creating it
     */
    useEffect(function sendOffer() {
        if (completeCreatingOffer) {
            const offerMessasge = {
                type: "offer",
                sender: name,
                receiver: peer,
                data: offer
            }

            webSocketSend(offerMessasge);
            setSendingSdpStepStatus('done');
            setWaitingSdpStepLoading(true);
        }
    }, [completeCreatingOffer, name, peer, offer, webSocketSend]);

    /**
     * Handles receiving an offer from the peer(caller)
     */
    const handleReceiveOffer = useCallback((offer: RTCSessionDescriptionInit) => {
        setOffer(offer);
    }, []);

    /** 
     * Handles applying the received offer from the peer(caller)
     */
    const handleAcceptRemoteOffer = async () => {
        startAcceptingOffer(offer!);
    }

    /**
     * Checks if the remote offer was successfully set and progresses to the next signaling step
     * - Activates the answer creation step
    */
    useEffect(function checkAcceptedOffer() {
        if (comleteAcceptingOffer) {
            setWaitingSdpStepStatus('done')
            setSendingSdpStepStatus('active');
        }

    }, [comleteAcceptingOffer]);


    /**
     * Handles creating an answer
     */
    const handleCreateAnswer = () => {
        startCreatingAnswer(handleSetAnswer);
    }

    /**
     * Sends the answer to the peer(caller) after successfully creating it
     */
    useEffect(function sendAnswer() {
        if (completeCreatingAnswer) {
            const answerMessasge = {
                type: "answer",
                sender: name,
                receiver: peer,
                data: answer
            }

            webSocketSend(answerMessasge);
            setSendingSdpStepStatus('done');
        }
    }, [completeCreatingAnswer, name, peer, answer, webSocketSend])

    /**
     * Handles setting the local or received answer
     */
    const handleSetAnswer = (answer: RTCSessionDescriptionInit) => {
        setAnswer(answer);
    }

    /**
     * Handles receiving an answer from the peer(callee)
     */
    const handleReceiveAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
        setAnswer(answer);
        setWaitingSdpStepLoading(false);
        setWaitingSdpStepStatus('active');
    }, []);

    /** 
     * Handles applying the received answer from the peer(callee)
     */
    const handleAcceptRemoteAnswer = async () => {
        startAcceptingAnswer(answer!);
    }

    /**
     * Checks if the remote answer was successfully set
    */
    useEffect(function checkAcceptedAnswer() {
        if (comleteAcceptingAnswer) {
            setWaitingSdpStepStatus('done')
        }

    }, [comleteAcceptingAnswer]);

    /**
     * Sends local ICE candidates to the peer whenever one is gathered
     * - ICE gathering begins after setting the local SDP (offer for caller, answer for callee)
     * - Each ICE candidate is sent to the peer as it is discovered
     */
    useEffect(function exhangeIceCandidate() {
        if (iceCandidate) {
            const iceCandidateMessage = {
                type: "candidate",
                sender: name,
                receiver: peer,
                data: iceCandidate
            }

            webSocketSend(iceCandidateMessage);
        }
    }, [iceCandidate, name, peer, webSocketSend]);

    /**
     * Handles setting the received ICE candidate from the peer
     * - ICE candidates can only be added after the remote SDP (offer/answer) has been set
     * - If the remote SDP is already set, add the ICE candidate to the peer connection immediately
     * - Otherwise, buffer the candidate by storing it in state to add later
     */
    const handleReceiveIceCandidate = useCallback((iceCandidate: RTCIceCandidate) => {
        if (comleteAcceptingOffer || comleteAcceptingAnswer) {
            addIceCandidate(iceCandidate);
        } else {
            setIceCandidates(prev => [...prev, iceCandidate]); // buffering
        }
    }, [addIceCandidate, comleteAcceptingOffer, comleteAcceptingAnswer])

    /**
     * Adds buffered ICE candidates once local ICE gathering is complete and the remote SDP (offer or answer) has been set
     */
    useEffect(function checkGatheredIceCandidate() {
        if (comleteAcceptingOffer || comleteAcceptingAnswer) {
            iceCandidates.forEach(candidate => {
                addIceCandidate(candidate);
            });
        }
    }, [iceCandidates, comleteAcceptingOffer, comleteAcceptingAnswer, addIceCandidate])

    /**
     * Checks whether ICE candidate exchange has completed successfully and updates the candidate step status to reflect a successful connection
     */
    useEffect(function checkIceConnectionState() {
        if (completeIceCandidateExchange) {
            setCandidateStepStatus('done');
        }

    }, [completeIceCandidateExchange])


    /** 
     * Handles starting the video call by displaying the call view 
     */
    const handleStartCall = () => {
        setVideoGroupCallDisplay(true);
    }

    /** 
     * Handles toggling the video call view mode
     */
    const handleChangeMode = () => {
        setDefaultMode(!defaultMode);
    }

    /** 
     * Handles showing or hiding the device settings modal 
     */
    const handleDeviceSettingsDisplay = () => {
        setDeviceSettingsDisplay(!deviceSettingsDisplay);
    }

    /** 
     * Handles toggling the video display order between local and remote 
     */
    const handleChangeOrder = () => {
        setDefaultOrder(!defaultOrder);
    }

    /** 
     * Handles hanging up the call and navigating back to the home page 
     */
    const handleHangUp = () => {
        const hangUpMessage = {
            type: "hangUp",
            sender: name,
            receiver: peer
        }

        webSocketSend(hangUpMessage);
        handleNavigateToHome(name!);
    }

    /** 
     * Handles receiving a hangUp message from the peer and exiting the call 
     */
    const handleReceiveHangUp = useCallback(() => {
        handleNavigateToHome(name!);
    }, [handleNavigateToHome, name]);

    /** 
     * WebSocket message handler 
     * */
    const handleWebSocketMessage = useCallback((e: MessageEvent) => {
        const message = JSON.parse(e.data);
        console.log('📨 Received:', message);

        switch (message.type) {
            case JOIN: // Rejoin triggered by page reload
                if (message.data.result) {
                    break;
                } else {
                    // On join failure, disconnect and go to join page
                    webSocketDisconnect();
                    handleNavigateToJoin();
                }
                break;
            case HANG_UP: // Hanging up when the peer ends the call
                handleReceiveHangUp();
                break;
            case OFFER: // Receiving the peer's offer
                handleReceiveOffer(message.data);
                break;
            case ANSWER: // Receiving the peer's answer
                handleReceiveAnswer(message.data);
                break;
            case CANDIDATE: // Receiving the peer's ICE candidate
                handleReceiveIceCandidate(message.data);
                break;
        }
    }, [webSocketDisconnect, handleNavigateToJoin, handleReceiveHangUp, handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);

    /**
     * Reconnects WebSocket if disconnected, or replaces message handler if already connected
     */
    useEffect(function checkWebSocketConnection() {
        if (!webSocketIsConnected) {
            webSocketConnect(SIGNALING_URL, handleWebSocketMessage, name!);
        } else {
            webSocketSetOnMessage(handleWebSocketMessage);
        }
    }, [webSocketIsConnected, webSocketConnect, webSocketSetOnMessage, handleWebSocketMessage, name])


    return (
        <Container>
            <Body>

                <MainBox>
                    {!videoGroupCallDisplay &&
                        <>
                            <Title>WebRTC Connection Setup</Title>
                            <SubTitle>Follow the steps below to start a video call.</SubTitle>

                            <StepBoxContainer>
                                <StepBox
                                    order={1}
                                    title={'My Video Settings'}
                                    description={'Set up your video and audio streams before sending an offer or answer.'}
                                    icon={creatinglocalStreamLoading ?
                                        <Loader2 size={18} color={'white'} className='spin' /> :
                                        <PictureInPicture2 size={18} color={'white'} />}

                                    buttonText={'Set Up Video & Audio'}
                                    handleClickButton={startCreatingLocalStream}
                                    status={videoStepStatus}
                                    isVideo={true}
                                    localVideoStream={localVideoStream}
                                />

                                {role === CALLER ?
                                    <>
                                        <StepBox
                                            order={2}
                                            title={'Create and Send Offer'}
                                            description={'Generate an offer to initiate the connection and send it to the peer.'}
                                            icon={creatingOfferLoading ?
                                                <Loader2 size={18} color={'white'} className='spin' /> :
                                                <Send size={18} color={'white'} />
                                            }

                                            buttonText={'Create and Send Offer'}
                                            handleClickButton={handleCreateOffer}
                                            status={sendingSdpStepStatus}
                                            isVideo={false}
                                        />
                                        <StepBox
                                            order={3}
                                            title={'Wait and Set Remote Answer'}
                                            description={'Wait for the peer\'s answer and set it once received.'}
                                            icon={(waitingSdpStepLoading || acceptingAnswerLoading) ?
                                                <Loader2 size={18} color={'white'} className='spin' /> :
                                                <ArrowDownCircle size={18} color={'white'} />}

                                            buttonText={waitingSdpStepLoading ? 'Waiting for Peer\'s Answer' : 'Set Answer'}
                                            handleClickButton={handleAcceptRemoteAnswer}
                                            status={waitingSdpStepStatus}
                                            isVideo={false}
                                        />
                                    </>
                                    :
                                    <>
                                        <StepBox
                                            order={2}
                                            title={'Wait and Set Remote Offer'}
                                            description={'Wait for the peer\'s offer and set it once received.'}
                                            icon={(waitingSdpStepLoading || acceptingOfferLoading) ?
                                                <Loader2 size={18} color={'white'} className='spin' /> :
                                                <ArrowDownCircle size={18} color={'white'} />
                                            }

                                            buttonText={waitingSdpStepLoading ? 'Waiting for Peer\'s Offer' : 'Set Offer'}
                                            handleClickButton={handleAcceptRemoteOffer}
                                            status={waitingSdpStepStatus}
                                            isVideo={false}
                                        />

                                        <StepBox
                                            order={3}
                                            title={'Create and Send Answer'}
                                            description={'Generate an answer in response to the offer and send it to the peer.'}
                                            icon={creatingAnswerLoading ?
                                                <Loader2 size={18} color={'white'} className='spin' /> :
                                                <Send size={18} color={'white'} />}

                                            buttonText={'Create and Send Answer'}
                                            handleClickButton={handleCreateAnswer}
                                            status={sendingSdpStepStatus}
                                            isVideo={false}
                                        />
                                    </>
                                }

                                <StepBox
                                    order={4}
                                    title={'Exchange ICE Candidates'}
                                    description={'Gather and exchange ICE candidates to establish the network connection. Candidates are collected automatically when sending an offer or answer, and exchanged without user action.'}
                                    icon={!completeIceCandidateExchange && gatheringIceCandidateLoading ?
                                        <Loader2 size={18} color={'white'} className='spin' /> :
                                        <Combine size={18} color={'white'} />
                                    }
                                    buttonText={'Gather And Exchange Candidates'}
                                    handleClickButton={() => { }}
                                    status={candidateStepStatus}
                                    isVideo={false}
                                />

                            </StepBoxContainer>

                            <StartButton isActive={completeIceCandidateExchange} onClick={handleStartCall}>
                                Start Call
                            </StartButton>
                        </>
                    }


                    {videoGroupCallDisplay &&
                        <VideoGroup
                            localVideoStream={localVideoStream}
                            remoteVideoStream={remoteVideoStream}
                            defaultMode={defaultMode}
                            defaultOrder={defaultOrder}
                        />
                    }

                </MainBox>


                <Footer>
                    <CallStatusBox>
                        <CallTitle>Video Call</CallTitle>
                        <CallStatus>{completeIceCandidateExchange ? 'connected' : 'connecting.....'}</CallStatus>

                    </CallStatusBox>

                    <OptionButtonBox>
                        <OptionButton icon={<SwitchCamera size={20} />} isActive={completeIceCandidateExchange} hangUp={false} onClick={handleChangeOrder} />

                        <OptionButton icon={<Columns size={20} />} isActive={completeIceCandidateExchange} hangUp={false} onClick={handleChangeMode} />

                        <OptionButton icon={<Settings size={20} />} isActive={completeCreatingLocalStream} hangUp={false} onClick={handleDeviceSettingsDisplay} />

                        <OptionButton icon={<Phone size={20} style={{ transform: "rotate(135deg)" }} />} isActive={true} hangUp={true} onClick={handleHangUp} />
                    </OptionButtonBox>

                    {deviceSettingsDisplay &&
                        <DeviceSettings
                            audioDevices={audioDevices}
                            videoDevices={videoDevices}
                            selectedAudioDeviceId={selectedAudioDeviceId}
                            selectedVideoDeviceId={selectedVideoDeviceId}
                            switchDevices={switchDevices}
                            handleClose={handleDeviceSettingsDisplay}
                        />
                    }
                </Footer>

            </Body>
        </Container>
    )
}

export default Call;