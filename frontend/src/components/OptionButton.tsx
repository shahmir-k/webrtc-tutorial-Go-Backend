import { Container } from './styles/OptionButton.styles'



interface OptionButtonProps {
    icon: React.ReactNode;
    isActive: boolean;
    hangUp: boolean;
    onClick: () => void;
}



const OptionButton: React.FC<OptionButtonProps> = (props) => {
    const { icon, isActive, hangUp, onClick } = props

    return (
        <Container
            isActive={isActive}
            disabled={!isActive}
            hangUp={hangUp}
            onClick={onClick}
        >
            {icon}
        </Container>
    )
}

export default OptionButton;