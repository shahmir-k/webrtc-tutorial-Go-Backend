import { X, ChevronDown } from "lucide-react"
import { useState } from 'react';

import { Container, Header, Title, Body, OptionBox, OptionLabel, SelectedOption, OptionName, OptionList, Option } from './styles/DeviceSettings.styles';



interface DeviceSettingsProps {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
    selectedAudioDeviceId: string | undefined;
    selectedVideoDeviceId: string | undefined;
    switchDevices: (audioDeviceId: string, videoDeviceId: string) => void;
    handleClose: () => void;
}



const DeviceSettings: React.FC<DeviceSettingsProps> = (props) => {
    const { handleClose, audioDevices, videoDevices, selectedAudioDeviceId, selectedVideoDeviceId, switchDevices } = props;

    const [audioOptionDisplay, setAudioOptionDispaly] = useState<boolean>(false);
    const [videoOptionDisplay, setVideOptionDispaly] = useState<boolean>(false);

    const handleAudioOptionDisplay = () => {
        setVideOptionDispaly(false);
        setAudioOptionDispaly(!audioOptionDisplay);
    }


    const handleVideoOptionDisplay = () => {
        setAudioOptionDispaly(false);
        setVideOptionDispaly(!videoOptionDisplay);
    }


    return (
        <Container className='fade-slide-up'>
            <Header>
                <Title>Device Settings</Title>
                <X size={20} color={'rgb(148, 163, 184)'} cursor={'pointer'} onClick={handleClose} />

            </Header>

            <Body>
                <OptionBox>
                    <OptionLabel>Audio Device</OptionLabel>

                    <SelectedOption onClick={handleAudioOptionDisplay}>
                        <OptionName>
                            {audioDevices.find(device => device.deviceId === selectedAudioDeviceId)?.label}
                        </OptionName>
                        <ChevronDown size={16} color={'white'} />

                    </SelectedOption>

                    {audioOptionDisplay &&


                        <OptionList >
                            {audioDevices.map((device) => (
                                <Option
                                    key={device.deviceId}
                                    selected={selectedAudioDeviceId === device.deviceId}
                                    onClick={() => switchDevices(device.deviceId, selectedVideoDeviceId!)}
                                >
                                    {device.label || 'Unknown device'}
                                </Option>
                            ))}
                        </OptionList>
                    }
                </OptionBox>


                <OptionBox>
                    <OptionLabel>Video Device</OptionLabel>

                    <SelectedOption onClick={handleVideoOptionDisplay}>
                        <OptionName>
                            {videoDevices.find(device => device.deviceId === selectedVideoDeviceId)?.label}
                        </OptionName>
                        <ChevronDown size={16} color={'white'} />
                    </SelectedOption>

                    {videoOptionDisplay &&
                        <OptionList>
                            {videoDevices.map((device) => (
                                <Option
                                    key={device.deviceId}
                                    selected={selectedVideoDeviceId === device.deviceId}
                                    onClick={() => switchDevices(selectedAudioDeviceId!, device.deviceId!)}
                                >
                                    {device.label || 'Unknown device'}
                                </Option>
                            ))}
                        </OptionList>
                    }
                </OptionBox>

            </Body>
        </Container>
    )
}

export default DeviceSettings;