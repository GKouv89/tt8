# Endpoints

* (GET) /thematics/{id}/sessions/{id}/episodes/{id}/biosignals: Επιστρέφει τα βιομετρικά για τις οπτικοποιήσεις/ηχοποιήσεις του επεισοδίου.

# Requests
*   Query paramters in url: ?axis=1

# Responses

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