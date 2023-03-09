# Endpoints

(GET) /thematics/{id}/axes/{id}: Επιστρέφει το χρώμα ενός άξονα. Χρήσιμο για την οπτικοποίηση.
(GET) /thematics/{id}/sessions/{id}/episodes/{id}/biosignals: Επιστρέφει τα βιομετρικά για τις οπτικοποιήσεις/ηχοποιήσεις του επεισοδίου.

# Requests
Δεν είμαι καν σίγουρη ότι χρειάζεται κάποιο request payload. Νομίζω πως και τα 2
μπορούν να λειτουργήσουν με τα url parameters και τίποτα άλλο.

# Responses
* Endpoint για χρώμα άξονα: 
{
    color: '#FF0000'
}
* Endpoint για βιομετρικά:
{
    [   {
            friendly_name: 'Participant 1 Heart Rate',
            participant_id: 1, # To ID του συμμετέχοντα για την συνεδρία
            biosignal: HR, # Το choice του συμμετέχοντα
            path: /data/thematics/1/sessions/2/episodes/28/P1_HR.csv
        }
        ,
        ...
    ]
}