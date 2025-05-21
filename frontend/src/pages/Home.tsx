import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { CALLEE, CALLER } from '../constants/role';
import { JOIN, ACTIVE_USERS, CALL, CANCEL_CALL, ACCEPT_CALL } from '../constants/messageType';
import { SIGNALING_URL } from '../constants/endpoint';
import { Container, Body, CardBox, CallBackground } from './styles/Home.styles';
import { useWebSocketStore } from '../store/webSocketStore';
import { useNavigation } from '../hooks/useNavigation';
import WaitingCall from '../components/WaitingCall';
import IncomingCall from '../components/IncomingCall';
import Header from '../components/Header';
import ActiveUserCard from '../components/ActiveUserCard';
import { User } from '../types/User'



const Home = () => {
    const { handleNavigateToJoin, handleNavigateToCall } = useNavigation(); // Navigations for moving to the Join and Call page

    const { name } = useParams<{ name: string }>(); // Logged-in user's name
    const [users, setUsers] = useState<User[]>([]); // Arr of active users
    const [callee, setCallee] = useState<string>(''); // The user being called
    const [caller, setCaller] = useState<string>(''); // The user who initiated the call
    const [waitingCall, setWaitingCall] = useState<boolean>(false); // Whether to show the caller UI
    const [incomingCall, setIncomingCall] = useState<boolean>(false); // Whether to show the callee UI

    const {
        disconnect: webSocketDisconnect,
        connect: webSocketConnect,
        send: webSocketSend,
        isConnected: webSocketIsConnected,
        setOnMessage: webSocketSetOnMessage
    } = useWebSocketStore.getState();  // WebSocket managed by Zustand



    /** 
     * Handles when user clicks a user card to request a call 
     * */
    const handleRequestCall = (callee: User) => {
        const calleeName = callee.name;
        const status = callee.inCall;
        if (status) {
            return;
        }

        const callMessage = {
            type: CALL,
            sender: name,
            receiver: calleeName
        }

        webSocketSend(callMessage);
        setCallee(calleeName);
        setWaitingCall(true);
    }

    /** 
     * Handles call cancellation (by caller or callee) 
     * */
    const handleCancelCall = (receiver: string) => {
        const cancelCallMessage = {
            type: CANCEL_CALL,
            sender: name,
            receiver: receiver
        }

        webSocketSend(cancelCallMessage);
        setCallee('');
        setCaller('');
        setWaitingCall(false);
        setIncomingCall(false);
    }

    /**
     * Handles and displays the UI when an incoming call is received.
     */
    const handleReceiveCall = (sender: string) => {
        setIncomingCall(true);
        setCaller(sender);
    }

    /** 
     * Handles when either party cancels the call 
     * */
    const handleCloseIncommingCall = () => {
        setCallee('');
        setCaller('');
        setWaitingCall(false);
        setIncomingCall(false);
    }

    /**
     * Handles accepting the incoming call and navigates to the call room.
     */
    const handleAcceptCall = (peer: string) => {
        const acceptCallMessage = {
            type: ACCEPT_CALL,
            sender: name,
            receiver: caller
        }

        webSocketSend(acceptCallMessage);
        handleNavigateToCall(name!, CALLEE, peer);
    }

    /**
     * Handles navigation to the call room after the call request is accepted.
     */
    const handleEnterCallRoom = useCallback((peer: string) => {
        handleNavigateToCall(name!, CALLER, peer);
    }, [name, handleNavigateToCall])

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
            case ACTIVE_USERS: // Active user list
                setUsers(message.data.users);
                break;
            case CALL: // Incoming call
                handleReceiveCall(message.sender);
                break;
            case CANCEL_CALL: // Call canceled by peer
                handleCloseIncommingCall();
                break;
            case ACCEPT_CALL: // Peer accepted the call
                handleEnterCallRoom(message.sender);
                break;

        }
    }, [webSocketDisconnect, handleEnterCallRoom, handleNavigateToJoin])

    /**
     * Reconnects WebSocket if disconnected, or replaces message handler if already connected.
     */
    useEffect(function checkWebSocketConnection() {
        if (!webSocketIsConnected) {
            webSocketConnect(SIGNALING_URL, handleWebSocketMessage, name!);
        } else {
            webSocketSetOnMessage(handleWebSocketMessage);

            const activeUsersMessage = {
                type: ACTIVE_USERS,
                sender: name
            }

            webSocketSend(activeUsersMessage);
        }
    }, [webSocketIsConnected, webSocketConnect, handleWebSocketMessage, webSocketSend, webSocketSetOnMessage, name])



    return (
        <Container>
            <Header
                exitText='Logout'
                handleExit={handleNavigateToJoin}
            />
            <Body>
                <CardBox>
                    {users
                        .filter((user) => user.name !== name)
                        .map((user) => (
                            <ActiveUserCard
                                key={user.name}
                                user={user}
                                handleCallRequest={handleRequestCall}
                            />
                        ))}

                </CardBox>
            </Body>


            {waitingCall &&
                <CallBackground className='fade-in'>
                    <WaitingCall
                        receiver={callee}
                        handleCancelCall={handleCancelCall}
                    />

                </CallBackground>
            }

            {incomingCall &&
                <CallBackground className='fade-in'>
                    <IncomingCall
                        sender={caller}
                        handleAcceptCall={handleAcceptCall}
                        handleCancelCall={handleCancelCall}
                    />
                </CallBackground>
            }

        </Container>
    );
}

export default Home;