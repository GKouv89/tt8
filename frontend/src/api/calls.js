export async function fetchThematicEpisodes(thematicID){
    const data = fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicID}/episodes/`)
                        .then((response) => response.json())
                        .catch((err) => {throw Error(err)});
    return data;
}

export async function fetchSceneMaterial(thematicID, sessionID, sceneID, axis){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicID}/sessions/${sessionID}/scenes/${sceneID}/biometrics/?axis=${axis}`)
                            .catch((err) => {throw Error(err)});
    const data = await response.json()
                    .catch((err) => {throw Error(err)});
    return data;
}