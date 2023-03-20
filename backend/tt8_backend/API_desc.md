# Endpoints

* (GET) thematics/{id}/sessions/{id}/scenes/{id}/biometrics/: Επιστρέφει τα βιομετρικά για 
τις οπτικοποιήσεις/ηχοποιήσεις του επεισοδίου.
## Request
*   Query parameters in url: ?axis=1

## Response

* 
    {
        [   {
                friendly_name: 'Participant 1 Biometrics',
                sensor_id_in_session: 1, # To ID του συμμετέχοντα για την συνεδρία
                biosignal: All, # Το choice του συμμετέχοντα
                path: 'https://transitionto8.athenarc.gr/data/Thematic1/Session2/Scene28/Scene28Sensor1All.csv'
            }
            ,
            ...
        ]
    }

* (GET) /thematics/{id}/sessions/{id}/scenes/ : Επιστρέφει τα επεισόδια μίας συνεδρίας

## Response
*   {
        [   {
                'episode_id_in_session': 22, 
                'axis': [
                    'axis_id_in_thematic': 1,
                    'color': '#FFFFFF',
                ]
            },
            ...
        ]
    }