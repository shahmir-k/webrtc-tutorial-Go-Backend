import { Container, Label, Input } from './styles/NameInput.styles';



interface NameInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



const NameInput: React.FC<NameInputProps> = (props) => {
    const { value, onChange } = props;

    return (
        <Container>
            <Input required type="text" name="text" value={value} onChange={onChange} />
            <Label>Name</Label>
        </Container>
    );
};

export default NameInput;
