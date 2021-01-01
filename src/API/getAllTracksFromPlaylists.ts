import { PlaylistDataType } from "./getAllPaylists"
import { TrackInfoType } from "./getCurrentlyPlayingTrack";

type AllTracksFromPlaylistsReturn = {
    status:AllTracksFromPlaylistsStatus,
    playlist_name?:string;
    all_tracks?:TrackInfoType[]
}

export type AllPlaylistDataWithTracksType = {
    playlist_name:string;
    all_tracks:TrackInfoType[]
}

enum AllTracksFromPlaylistsStatus {
    OK = 0,
    ERROR = 1
}

export const getAllTracksFromAllPlaylists = async (accessToken:string, playlistsData:PlaylistDataType[]):Promise<AllPlaylistDataWithTracksType[]> => {

    let allData:AllPlaylistDataWithTracksType[] = [];

    for(let i = 0; i < playlistsData.length; i++){
        let pData = await getAllTracksFromPlaylists(accessToken, playlistsData[i]);
        if(pData.status === AllTracksFromPlaylistsStatus.OK && pData.playlist_name && pData.all_tracks){
            
            allData.push({
                playlist_name:pData.playlist_name,
                all_tracks:pData.all_tracks
            });
        }
    }

    return allData;
}

export const getAllTracksFromPlaylists = async (accessToken:string, playlist:PlaylistDataType): Promise<AllTracksFromPlaylistsReturn> => {

    //const endpoint = playlistsData[0].tracks;
    const response = await fetch(playlist.tracks, {
        method:"GET",
        headers:{
            "Authorization": "Bearer " + accessToken,
        }
    });

    if(response.status === 200){
        let responseJson = await response.json();
    
        let tracks = [responseJson];

        // Api returns "next" that contains next "page", +(limit) offset tracks.
        // Here I combine all tracks.
        // https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/

        for(let i = 0; i < 10; i++){
            if(tracks[tracks.length - 1].next){
                let p = await getTracksFromPlaylists(accessToken, tracks[tracks.length - 1].next);

                tracks.push(p);
            }
        }

        let allTracks:TrackInfoType[][] = tracks.map((t_group:any) => {
            return t_group.items.map((t:any):TrackInfoType => {
                return {
                    name:t.track.name,
                    artist:t.track.artists[0].name,
                    album_image:t.track.album.images[1].url,
                    trackUrl:t.track.external_urls?.spotify
                }
            });
        });

        let combinedAllTracks:TrackInfoType[] = allTracks.reduce((acc, val) => acc.concat(val), []);

        return {
            status:AllTracksFromPlaylistsStatus.OK,
            playlist_name:playlist.name,
            all_tracks:combinedAllTracks
        }
        
    }else{
        return {
            status:AllTracksFromPlaylistsStatus.ERROR
        }
    }
}

export const getTracksFromPlaylists = async (accessToken:string, url:string) => {
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
