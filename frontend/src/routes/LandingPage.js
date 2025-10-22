import { useLoaderData } from 'react-router-dom';

export default function LandingPage() {
    const cities = useLoaderData();

    if (!cities.length) return <div>Loading...</div>;

    return (
        <div>
            <h1>Select a City</h1>
            <ul>
                {cities.map(city => (
                    <li key={city.name}>{city.name}</li>
                ))}
            </ul>
        </div>
    );
}