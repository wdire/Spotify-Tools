export enum LyricsStatus {
    OK = 0,
    NO_LYRICS_FOUND = 1,
    ERROR = 2
}

export type LyricsReturn = {
    status:LyricsStatus;
    lyrics?:string;
}

export const getSongLyrics = async (song:string, artist:string): Promise<LyricsReturn> => {

    song = song.split("-")[0].trim().split(" ").join("%20");
    artist = artist.split(" ").join("%20");

    const endpoint = `https://orion.apiseeds.com/api/music/lyric/${artist}/${song}?apikey=J04gkAi0mzSpy9U7nQ2kfRCmuYVCXJgCcfpRHC5ZWg3koFp7lsNsRxLmbElolF7q`;
    const response = await fetch(endpoint, {
        method:"GET"
    });

    if(response.status === 200){
        // Ok
        let responseJson = await response.json();

        return{
            status:LyricsStatus.OK,
            lyrics: responseJson.result.track.text
        }

    }else if(response.status === 404){
        // Not found lyrics
        
        return{
            status:LyricsStatus.NO_LYRICS_FOUND
        }
    }else{
        return{
            status:LyricsStatus.ERROR
        }
    }

    
}