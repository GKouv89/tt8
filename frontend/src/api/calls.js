export async function fetchThematicEpisodes(thematicName){
    const data = fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicName}/scenes/`)
                        .then((response) => response.json())
                        .catch((err) => {throw Error(err)});
    return data;
}

export async function fetchSceneMaterial(thematicName, axisID, sceneID){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicName}/axes/${axisID}/scenes/${sceneID}/biometrics/`)
                            .catch((err) => {throw Error(err)});
    const data = await response.json()
                    .catch((err) => {throw Error(err)});
    return data;
}