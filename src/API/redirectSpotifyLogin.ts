export const redirectSpotifyLogin = (redirectUri:string, privatePlaylists:boolean = true) => {

    const client_id = "2d6c58723f814902ab84d84a2a575a12";
    const redirect_uri = redirectUri; // set to domain
    const scopes = [
        "user-read-currently-playing",
        "playlist-read-private"
    ];
    
    const endpoint = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=false`;

    window.location.href = endpoint;
}