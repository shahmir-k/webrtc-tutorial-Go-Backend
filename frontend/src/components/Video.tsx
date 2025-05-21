import { Container } from './styles/Video.styles';



interface VideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
}



const Video: React.FC<VideoProps> = (props) => {
    const { videoRef } = props;

    return (
        <Container
            ref={videoRef}
            autoPlay
            playsInline
            muted>
        </Container>
    )
}

export default Video;