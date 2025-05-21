import { useParams } from 'react-router-dom';

import { Container, NameBox } from "./styles/Header.styles";
import SimpButton from './SimpleButton';



interface HeaderProps {
    exitText: string;
    handleExit: () => void;
}



const Header: React.FC<HeaderProps> = (props) => {
    const { exitText, handleExit } = props;
    const { name } = useParams<{ name: string }>();

    return (
        <Container>
            <NameBox>{name}</NameBox>
            <SimpButton
                onClick={handleExit}
                text={exitText}
                color='red'
            />

        </Container>
    )
}

export default Header;