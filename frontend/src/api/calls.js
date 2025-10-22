export async function fetchThematicEpisodes(cityName, thematicName){
    const data = fetch(`${process.env.REACT_APP_BASE_URL}cities/${cityName}/thematics/${thematicName}/scenes/`)
                        .then((response) => response.json())
                        .catch((err) => {throw Error(err)});
    return data;
}

export async function fetchSceneMaterial(cityName, thematicName, axisID, sceneID){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}cities/${cityName}/thematics/${thematicName}/axes/${axisID}/scenes/${sceneID}/biometrics/`)
                            .catch((err) => {throw Error(err)});
    const data = await response.json()
                    .catch((err) => {throw Error(err)});
    return data;
}

export async function fetchParticipantInSceneMaterial(cityName, thematicName, axisID, sceneID, participantID){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}cities/${cityName}/thematics/${thematicName}/axes/${axisID}/scenes/${sceneID}/biometrics/${participantID}/`)
        .catch((err) => {throw Error(err)});
    const data = await response.json()
        .catch((err) => {throw Error(err)});
    console.log('data: ', data);
    return data;
}

export async function fetchAllCities(){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}cities/`)
        .catch((err) => {throw Error(err)});
    const data = await response.json()
        .catch((err) => {throw Error(err)});
    return data;
}


export async function fetchThematicsPerCity(cityName) {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}cities/${cityName}/thematics/`)
        .catch((err) => { throw Error(err) });
    const data = await response.json()
        .catch((err) => { throw Error(err) });
    return data;
}