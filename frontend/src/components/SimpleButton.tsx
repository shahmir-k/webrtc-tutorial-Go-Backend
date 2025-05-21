import { Container } from './styles/SimpleButton.styles'



interface SimpleButtonProps {
    onClick?: () => void;
    text: string;
    color: string;
}



const SimpleButton: React.FC<SimpleButtonProps> = (props) => {
    const { onClick, text, color } = props;

    return (
        <Container
            color={color}
            onClick={onClick}
        >{text}</Container>
    )
}

export default SimpleButton;