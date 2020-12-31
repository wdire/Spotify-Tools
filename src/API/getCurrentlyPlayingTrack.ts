export type TrackInfoType = {
    name:string;
    artist:string;
    album_image:string;
    trackUrl?:string;
}

export type CurrentTrackResponse = {
    status:CurrentTrackStatus;
    trackInfo?:TrackInfoType;
    desc?:string;
}

export enum CurrentTrackStatus {
    OK = 0,
    NO_CONTENT = 1,
    ERROR = 3
}

export const getCurrentlyPlayingTrack = async (accessToken:string): Promise<CurrentTrackResponse> => {

    const endpoint = "https://api.spotify.com/v1/me/player/currently-playing";
    const response = await fetch(endpoint, {
        method:"GET",
        headers:{
            "Authorization": "Bearer " + accessToken,
        }
    });

    if(response.status === 200){
        //Ok
        let trackResponse = await response.json();

        let trackInfo:TrackInfoType = {
            name:trackResponse.item.name,
            artist:trackResponse.item.artists[0].name,
            album_image:trackResponse.item.album.images[1].url
        };
    
        return {
            status:CurrentTrackStatus.OK,
            trackInfo
        };

    }else if(response.status === 204){
        //No Content
        return {
            status:CurrentTrackStatus.NO_CONTENT,
            desc:"Currently you are not listening a song."
        };
    }else{
        //Error
        return {
            status:CurrentTrackStatus.ERROR,
            desc:"A error occured while getting song from Spotify."
        };
    }

}