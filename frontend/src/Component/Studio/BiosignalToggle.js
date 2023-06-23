import { ToggleButton } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function BiosignalToggle({biosignal, prefix, callback}){
    const biosignals = [
        {
            name: 'Heart Rate',
            value: 'HR',
        },
        {
            name: 'Galvanic Skin Response',
            value: 'GSR',            
        },
        {
            name: 'Temperature', 
            value: 'Temp',
        },
    ];

    return(
        <ButtonGroup>
            {biosignals.map((signal, idx) => (
                <ToggleButton
                    variant='dark'
                    key={idx}
                    id={`${prefix}-radio-${idx}`}
                    type="radio"
                    name={`${prefix}-radio`}
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