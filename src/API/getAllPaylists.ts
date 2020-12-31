export type AllPlaylistsReturnType = {
    status:AllPaylistsStatus;
    playlistData?:PlaylistDataType[];
}

export type PlaylistDataType = {
    name:string;
    tracks:string;
}

export enum AllPaylistsStatus {
    OK = 0,
    ERROR = 1
}

export const getAllPaylists = async (accessToken:string):Promise<AllPlaylistsReturnType> => {

        const endpoint = `https://api.spotify.com/v1/me/playlists?limit=50`;
        const response = await fetch(endpoint, {
            method:"GET",
            headers:{
                "Authorization": "Bearer " + accessToken,
            }
        });

        if(response.status === 200){
            let responseJson = await response.json();
            let playlists = [responseJson];

            // Api returns "next" that contains next "page", +(limit) offset playlists.
            // Here I combine all playlists.
            // https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/

            for(let i = 0; i < 3; i++){
                if(playlists[playlists.length - 1].next){
                    let p = await getPlaylists(accessToken, playlists[playlists.length - 1].next);

                    playlists.push(p);
                }
            }

            let combinedPlaylists = playlists.map((p_group:any) => {
                return p_group.items.map((p:any):PlaylistDataType=>{
                    return {
                        name: p.name,
                        tracks:p.tracks
                    }
                }); 
            });
            
            combinedPlaylists = combinedPlaylists.reduce((acc, val) => acc.concat(val), []);

            return {
                status:AllPaylistsStatus.OK,
                playlistData:combinedPlaylists
            }; 
        }else{
            return{
                status:AllPaylistsStatus.ERROR
            }
        }
}

const getPlaylists = async (accessToken:string, url:string) => {

    const endpoint = url;
    const response = await fetch(endpoint, {
        method:"GET",
        headers:{
            "Authorization": "Bearer " + accessToken,
        }
    });

    if(response.status === 200){
        let responseJson = await response.json();

        return responseJson;
    }else{
        // Error
        return false;
    }

}


