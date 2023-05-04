import { ToggleButton } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function BiosignalToggle({biosignal, callback}){
    const biosignals = [
        {name: 'Heart Rate', value: 'HR'},
        {name: 'Galvanic Skin Response', value: 'GSR'},
        {name: 'Temperature', value: 'Temp'},
    ];

    return(
        <ButtonGroup>
            {biosignals.map((signal, idx) => (
                <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    name="radio"
                    value={signal.value}
                    checked={biosignal === signal.value}
                    onChange={(e) => {callback(e.currentTarget.value);}}
                >
                    {signal.name}
                </ToggleButton>                            
            ))}
        </ButtonGroup>
    );
}