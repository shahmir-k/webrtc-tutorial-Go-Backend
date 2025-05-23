import { Container, HelperTextBox } from './styles/Join.styles';
import { useState, useEffect } from 'react';

import { JOIN } from '../constants/messageType';
import { SIGNALING_URL } from '../constants/endpoint';
import { useWebSocketStore } from '../store/webSocketStore';
import { useNavigation } from '../hooks/useNavigation';
import CallButton from '../components/SimpleButton';
import NicknameInput from '../components/NameInput';



const Join = () => {
    const { handleNavigateToHome } = useNavigation(); // Navigation for moving to the Home page

    const [nameInput, setNameInput] = useState<string>(''); // Name input value
    const [helperTextDisplay, setHelperTextDisplay] = useState<boolean>(false); // Whether to show helper text

    const {
        connect: webSocketConnect,
        disconnect: webSocketDisconnect,
    } = useWebSocketStore.getState(); // WebSocket managed by Zustand


    /**
     * Handles incoming WebSocket messages
     */
    const handleWebSocketMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        console.log('📨 Received:', message);

        switch (message.type) {
            case JOIN:
                if (message.data.result) { // Navigate to home page if join is successful
                    handleNavigateToHome(message.receiver);
                    break;
                } else { // Show helper text and disconnect if join fails
                    setHelperTextDisplay(true);
                    webSocketDisconnect();
                }

                break;
        }
    }

    /** 
     * Handles updating the name input state on input change
     * */
    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value);
    };

    /** 
     * Handles initiating WebSocket connection with user name
     * */
    const handleJoin = () => {
        webSocketConnect(SIGNALING_URL, handleWebSocketMessage, nameInput);
    }

    /** 
     * Handles WebSocket disconnection when the component mounts (initial cleanup)
     * */
    useEffect(function reset() {
        webSocketDisconnect();
    }, [webSocketDisconnect]);



    return (
        <Container>

            <NicknameInput
                value={nameInput}
                onChange={handleNameInputChange}
            />

            {helperTextDisplay &&
                <HelperTextBox>❌ Join failed: duplicated name</HelperTextBox>
            }

            <CallButton
                onClick={handleJoin}
                text='Join'
                color='green'
            />

        </Container>
    )
}

export default Join;