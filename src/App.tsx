import React from "react";
import { CurrentTrackResponse, CurrentTrackStatus, getCurrentlyPlayingTrack, TrackInfoType } from "./API/getCurrentlyPlayingTrack";

import {redirectSpotifyLogin} from "./API/redirectSpotifyLogin";

import { 
    setAccessToken, 
    getPartsOfUrl, 
    AccessTokenDataType, 
    AccessTokenDataCookieType, 
    getAccessToken, 
    checkLoggedIn
} from "./utils";

import {
    GlobalStyle, LoginButton, Main, ToolSelect, ToolSelectItem
} from "./App.styles";

export enum Tools {
    EMPTY = 0,
    GET_LYRICS = 1,
    SEARCH_IN_PLAYLISTS = 2
}

interface IProps{
}

interface IState{
    access_token:string;
    current_song_info:TrackInfoType;
    selected_tool:Tools;
    logged_in:boolean;
}

export class App extends React.Component<IProps, IState>{
    redirectUri:string;

    constructor(props: IProps){
        super(props);

        this.redirectUri = "http://localhost:3000";

        this.state = {
            access_token:"",
            current_song_info:{
                name:"",
                artist:"",
                album_image:""
            },
            selected_tool:Tools.EMPTY,
            logged_in:false
        }
    }

    async componentDidMount(){
        //Get token from cookies if exists
        let accessTokenData = getAccessToken();
        let loggedIn = checkLoggedIn();

        if(accessTokenData){
            console.log("Here is the good old(max 3600 sec) Token");

            if(window.location.hash){
                window.location.href = this.redirectUri;
            }

            let accessToken:AccessTokenDataCookieType = JSON.parse(accessTokenData);
            this.setState({access_token:accessToken.access_token});            

            if(loggedIn){
                this.getCurrentTrack(accessToken.access_token);
                this.setTool(Tools.GET_LYRICS);
            }

        }else{
            console.log("No Token");
            //If url has hash(#), we hope it contains access_token
            if(window.location.hash){
                // Remove hash and split into parts url
                let accessTokenData:AccessTokenDataType = getPartsOfUrl(window.location.hash.substring(1));

                //Set access token to cookies
                await setAccessToken(accessTokenData);

                window.location.href = this.redirectUri;
            }else{
                if(loggedIn){
                    this.loginSpotify();
                }
            }
        }
         
        this.setState({logged_in: (loggedIn ? true : false) });

    }

    loginSpotify = (privatePlaylists = false) => {
        redirectSpotifyLogin(this.redirectUri, privatePlaylists);
    }

    setTool = (tool:Tools) => {
        this.setState({selected_tool:tool});
    }

    getCurrentTrack = async (access_token:string) => {
        let trackInfo:CurrentTrackResponse = await getCurrentlyPlayingTrack(access_token);

        if(trackInfo.status === CurrentTrackStatus.OK && trackInfo.trackInfo){
            this.setState({current_song_info:trackInfo.trackInfo});
        }
        else if(trackInfo.status === CurrentTrackStatus.NO_CONTENT){
            // Show error, desc message
        }else if(trackInfo.status === CurrentTrackStatus.ERROR){
            // Refresh page
            alert("Spotify login timed out or an error occured try refresh to fix");
        }

    }

    render(){

        return (
            <>
                <GlobalStyle/>
                <Main>
                    <h1>Spotify <span>Tools</span></h1>
                    <ToolSelect>
                        <ToolSelectItem selected={this.state.selected_tool === Tools.GET_LYRICS ? true : false}>Get Lyrics</ToolSelectItem>
                        <ToolSelectItem selected={this.state.selected_tool === Tools.SEARCH_IN_PLAYLISTS ? true : false}>Search in Playlists</ToolSelectItem>
                    </ToolSelect>

                    {
                        !this.state.logged_in ? ( 
                            <>
                                <LoginButton onClick={() => { this.loginSpotify() }}>
                                    <img src="images/spotify-white_small.png" alt="Spotify Logo"/>
                                    <div>Login Spotify</div>
                                </LoginButton>
                            </>
                        ) : null
                    }
                    

                </Main>
            </>
        );
    }

}