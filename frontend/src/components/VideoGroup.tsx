import { useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, VerticalBox, VerticalSingleBox, OverlayBox, FloatBox, VideoBox, Video, Name } from './styles/VideoGroup.styles';



interface VideoGroupProps {
    localVideoStream: MediaStream | null;
    remoteVideoStream: MediaStream | null;
    defaultMode: boolean;
    defaultOrder: boolean;
}



const VideoGroup: React.FC<VideoGroupProps> = (props) => {
    const { localVideoStream, remoteVideoStream, defaultMode, defaultOrder } = props;
    const { name, peer } = useParams<{ name: string; role: string; peer: string }>();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(function init() {
        if (localVideoRef.current && localVideoStream && remoteVideoRef.current && remoteVideoStream) {
            if (defaultOrder) {
                localVideoRef.current.srcObject = localVideoStream;
                remoteVideoRef.current.srcObject = remoteVideoStream;
            } else {
                localVideoRef.current.srcObject = remoteVideoStream;
                remoteVideoRef.current.srcObject = localVideoStream;
            }
        }
    }, [localVideoStream, remoteVideoStream, defaultMode, defaultOrder]);



    return (
        <Container>
            {defaultMode &&
                <OverlayBox>
                    <VideoBox defaultView={defaultMode}>
                        <Video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted={defaultOrder ? true : false}
                        />

                        <Name>{defaultOrder ? `${name}(me)` : peer}</Name>

                        <FloatBox>
                            <VideoBox defaultView={defaultMode}>
                                <Video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    muted={defaultOrder ? false : true}
                                />
                            </VideoBox>
                            <Name>{defaultOrder ? peer : `${name}(me)`}</Name>
                        </FloatBox>
                    </VideoBox>
                </OverlayBox>
            }
            {!defaultMode &&


                <VerticalBox>
                    <VerticalSingleBox>
                        <VideoBox defaultView={defaultMode}>
                            <Video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted={defaultOrder ? true : false}
                            />

                            <Name>{defaultOrder ? `${name}(me)` : peer}</Name>
                        </VideoBox>

                    </VerticalSingleBox>
                    <VerticalSingleBox>
                        <VideoBox defaultView={defaultMode}>
                            <Video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                muted={defaultOrder ? false : true}
                            />

                            <Name>{defaultOrder ? peer : `${name}(me)`}</Name>
                        </VideoBox>

                    </VerticalSingleBox>

                </VerticalBox>
            }
        </Container>
    )
}

export default VideoGroup;