import { Container, Row, Col, Image } from 'react-bootstrap';
import logo1 from '../assets/logos/athenalogo.png';
import logo2 from '../assets/logos/mentorlogo.png';
import logo3 from '../assets/logos/ekpalogo.png';
import logo4 from '../assets/logos/fundinglogo.png';


export default function Footer() {
    const footerStyle = {
        width: '100%',
        padding: '20px',
        marginTop: 'auto'
    };

    const logoStyle = {
        height: '50px',
        width: 'auto',
        objectFit: 'contain'
    };

    return (
        <footer style={footerStyle}>
            <Container fluid>
                <Row className="align-items-center justify-content-evenly">
                    <Col xs="auto">
                        <Image src={logo1} alt="Athena Research Center logo" style={logoStyle} />
                    </Col>
                    <Col xs="auto">
                        <Image src={logo2} alt="Mentor logo" style={logoStyle} />
                    </Col>
                    <Col xs="auto">
                        <Image src={logo3} alt="NKUA logo" style={logoStyle} />
                    </Col>
                    <Col xs="auto">
                        <Image src={logo4} alt="Cofinanced by Greece and the European Union" style={logoStyle} />
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}