import { apiCalls } from './comm';



async function createGame(gameName, capacity, description     ,date, time) {
    return await apiCalls.handleNewResponse(
        await apiCalls.api.post(
            `lobby/${gameName}`,
            JSON.stringify({capacity: capacity, description: description,
            date: date,
            time: time,
            
            }),
            apiCalls.getAuthenticationHeader()
        )
    );

}

async function getGames() {
    return await apiCalls.handleNewResponse(
        await apiCalls.api.get(
            "lobby/",
//             {
//                 ...            JSON.stringify({"username": username}),
// ...                
//             }
            apiCalls.getAuthenticationHeader()
    
        )
    );
}

// async function getSpecificGame(name) {
//     return await apiCalls.handleNewResponse(
//         await apiCalls.api.get(
//             `lobby/${name}`,
//             apiCalls.getAuthenticationHeader()
//         )
//     );
// }


// todo missing data
async function leaveGame(gameName) {
    return await apiCalls.handleNewResponse(
        await apiCalls.api.put(
            `lobby/${gameName}`,
            JSON.stringify({"leave": true}),
            apiCalls.getAuthenticationHeader()
        )
    );
}

async function modifyPost(index, modification) {
    return await apiCalls.handleNewResponse(
        await apiCalls.api.put(
            `lobby/${index}`,
            JSON.stringify({action: modification}),
            apiCalls.getAuthenticationHeader()
        )
    );
}

// todo check if this is hist post in BE
async function updatePost(index, modification) {
    modification['action'] = "update";

    return await apiCalls.handleNewResponse(
        await apiCalls.api.put(
            `lobby/${index}`,
            JSON.stringify(modification),
            apiCalls.getAuthenticationHeader()
        )
    );
}

async function joinGame(gameName) {
    return await apiCalls.handleNewResponse(
        await apiCalls.api.put(
            `lobby/${gameName}`,
            JSON.stringify({"join": true}),
            apiCalls.getAuthenticationHeader()
        )
    );
}

export const apiLobby = {
    createGame,
    getGames,
    leaveGame,
    joinGame,
    modifyPost,
    // getSpecificGame,
    updatePost,

}
