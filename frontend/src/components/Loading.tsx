import { Container } from './styles/Loading.styles';



const Loading = () => {
    return (
        <Container>
            <div className="loader">
                <div className="circle circle-1" />
                <div className="circle circle-2" />
                <div className="circle circle-3" />
                <div className="circle circle-4" />
            </div>
        </Container>
    )
}

export default Loading;