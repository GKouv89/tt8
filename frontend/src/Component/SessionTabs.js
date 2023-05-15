import Nav from 'react-bootstrap/Nav';

export default function SessionTabs(){
    return(
        <Nav variant="tabs" defaultActiveKey="session-1">
            <Nav.Item>
                <Nav.Link style={{'color': 'black'}} data-to-scrollspy-id="first" eventKey="session-1" href="#first">Session 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link style={{'color': 'black'}} data-to-scrollspy-id="second" eventKey="session-2" href="#second">Session 2</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}