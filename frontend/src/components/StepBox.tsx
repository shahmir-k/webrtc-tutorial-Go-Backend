import { ReactNode, useRef, useEffect } from "react";
import { Check } from 'lucide-react';

import { Status } from '../types/StepStatus';
import { Container, OrderIcon, ContentBox, Title, Description, SendButton, ButtonText, LocalVideo } from './styles/StepBox.styles';



interface StepBoxProps {
    order: number;
    title: string;
    description: string;
    icon: ReactNode;
    buttonText: string;
    handleClickButton: () => void;
    status: Status;
    isVideo: boolean,
    localVideoStream?: MediaStream | null;
}



const StepBox: React.FC<StepBoxProps> = (props) => {
    const {
        order,
        title,
        description,
        icon,
        buttonText,
        handleClickButton,
        status,
        isVideo,
        localVideoStream
    } = props;

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(function init() {
        if (videoRef.current && localVideoStream) {
            videoRef.current.srcObject = localVideoStream;
        }

    }, [localVideoStream]);


    return (
        <Container status={status}>
            <OrderIcon status={status}>
                {status === 'done' ? <Check size={18} /> : order}
            </OrderIcon>

            <ContentBox>
                <Title>{title}</Title>
                <Description>{description}</Description>

                {isVideo &&
                    <LocalVideo
                        ref={videoRef}
                        status={status}
                        autoPlay
                        playsInline
                        muted
                    />
                }



                <SendButton onClick={handleClickButton} status={status} disabled={status !== 'active'}>
                    {icon}
                    <ButtonText>{status === 'done' ? 'Done' : buttonText}</ButtonText>
                </SendButton>

            </ContentBox>

        </Container>
    )
}

export default StepBox;