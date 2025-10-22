import { Link, useLoaderData } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import logo1 from '../assets/logos/athenalogo.png';
import logo2 from '../assets/logos/mentorlogo.png';
import logo3 from '../assets/logos/ekpalogo.png';
import logo4 from '../assets/logos/fundinglogo.png';

export default function LandingPage() {
    const cities = useLoaderData();

    if (!cities.length) return <div>Loading...</div>;

    return (
        <><div>
            <h1>Select a City</h1>
            <ul>
                {cities.map(city => (
                    <Link key={city.name} to={`/${city.name}/thematics`}>
                        <li>{city.name}</li>
                    </Link>
                ))}
            </ul>
        </div><Footer /></>
    );
}

function Footer() {
    const footerStyle = {
        width: '100%',
        padding: '20px',
        // backgroundColor: '#f8f9fa',
        position: 'fixed',
        bottom: 0,
        left: 0
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