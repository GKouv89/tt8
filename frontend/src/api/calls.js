export async function fetchThematicScenes(thematicID, sessionIDs){
    let ret = [];
    const responses = await Promise.all(sessionIDs.map((id) => fetchSessionScenes(thematicID, id)))
                                .catch((err) => {throw Error(err)});
    const data = await Promise.all(responses.map((response) => response.json()))
                                .catch((err) => {throw Error(err)});
    data.map((d, idx) => ret.push({'session': idx+1, 'scenes': d}));
    return ret;
}

function fetchSessionScenes(thematicID, sessionID){
    return fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicID}/sessions/${sessionID}/scenes/`);
}

export async function fetchSceneMaterial(thematicID, sessionID, sceneID, axis){
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}thematics/${thematicID}/sessions/${sessionID}/scenes/${sceneID}/biometrics/?axis=${axis}`)
                            .catch((err) => {throw Error(err)});
    const data = await response.json()
                    .catch((err) => {throw Error(err)});
    return data;
}