import { Container } from './styles/ActiveUserCard.styles';
import { User } from '../types/User';



interface ActiveUserCardProps {
    user: User;
    handleCallRequest: (callee: User) => void;
}

const ActiveUserCard: React.FC<ActiveUserCardProps> = (props) => {
    const { user, handleCallRequest } = props;
    const name = user.name;
    const status = user.inCall;

    return (
        <Container onClick={() => handleCallRequest(user)} status={status}>
            <div className="card">
                <div className="first-content">
                    <span>{name}</span>
                </div>
                <div className="second-content">
                    <span>{status ? 'Busy' : 'Call'}</span>
                </div>
            </div>
        </Container>
    )
}

export default ActiveUserCard;