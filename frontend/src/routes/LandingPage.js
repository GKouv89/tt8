import { Link, useLoaderData } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Footer from '../Component/Footer';

export default function LandingPage() {
    const cities = useLoaderData();

    if (!cities.length) return (
        <Container fluid className="py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
                <div className="spinner-border text-muted" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading cities...</p>
            </div>
        </Container>
    );

    return (
        <>
            <Container fluid className="py-4" style={{ paddingBottom: '120px' }}>
                <Row className="justify-content-center">
                    <Col lg={8} xl={8} xxl={8} className="text-start">
                        
                        {/* Header Section */}
                        <div className="mb-5">
                            <h1 className="mb-3 text-start display-4">Sonifications & Visualizations Platform</h1>
                            <p className="mb-3 text-muted text-start fs-5">
                                Transition to 8 aims to initiate public discourse concerning important social issues across European cities. Through
                                sociodrama sessions, residents deal with the effects of these issues in their daily lives. Biometric data from these
                                sessions are then transformed into sonifications and visualizations, which serve as source material for artistic creation.
                            </p>
                            <p className="mb-3 text-start fs-5"><a href="https://www.transitionto8.com/" target="_blank" rel="noopener noreferrer">Learn more</a> about the project.</p>
                        </div>

                        {/* Cities Grid */}
                        <div className="d-flex flex-column gap-3">
                            {cities.map(city => (
                                <Link 
                                    key={city.name} 
                                    to={`/${city.name}/thematics`}
                                    className="text-decoration-none"
                                >
                                    <Card className="border-0 shadow-sm h-100 city-card">
                                        <Card.Body className="p-4">
                                            <Row className="align-items-center">
                                                <Col>
                                                    <h3 className="mb-2 text-dark">{city.name}</h3>
                                                </Col>
                                                <Col xs="auto">
                                                    <i className="bi bi-arrow-right text-muted fs-4"></i>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        
                    </Col>
                </Row>
            </Container>
            <Footer />
            
            <style jsx>{`
                .city-card {
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }
                .city-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
            `}</style>
        </>
    );
}
