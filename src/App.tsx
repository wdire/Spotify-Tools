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
    GlobalStyle, LoginButton, Main, RefreshButton, ToolSelect, ToolSelectItem
} from "./App.styles";

import { SongLyrics } from "./components/SongLyrics";
import { PlaylistSearch } from "./components/PlaylistSearch";
import { getAllPaylists } from "./API/getAllPaylists";

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
    currentlySongPlaying:boolean;
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
            currentlySongPlaying:false,
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

            if(trackInfo.trackInfo.name !== this.state.current_song_info.name){
                this.setState({current_song_info:trackInfo.trackInfo});
            }

            this.setState({currentlySongPlaying:true});
        }
        else if(trackInfo.status === CurrentTrackStatus.NO_CONTENT){
            this.setState({currentlySongPlaying:false});
        }else if(trackInfo.status === CurrentTrackStatus.ERROR){
            // Refresh page
            alert("Spotify login timed out or an error occured try refresh to fix");
        }

        console.log(await getAllPaylists(this.state.access_token));

    }

    render(){

        return (
            <>
                <GlobalStyle/>
                <Main>
                    <h1>Spotify <span>Tools</span></h1>
                    <ToolSelect>
                        <ToolSelectItem onClick={()=>{this.setTool(Tools.GET_LYRICS)}} selected={this.state.selected_tool === Tools.GET_LYRICS ? true : false}>Get Lyrics</ToolSelectItem>
                        <ToolSelectItem onClick={()=>{this.setTool(Tools.SEARCH_IN_PLAYLISTS)}} selected={this.state.selected_tool === Tools.SEARCH_IN_PLAYLISTS ? true : false}>Search in Playlists</ToolSelectItem>
                    </ToolSelect>

                    {
                        !this.state.logged_in ? ( 
                            <>
                                <LoginButton key="login" onClick={() => { this.loginSpotify() }}>
                                    <img src="images/spotify-white_small.png" alt="Spotify Logo"/>
                                    <div>Login Spotify</div>
                                </LoginButton>
                            </>
                        ) : null
                    }
                    
                    {
                        (
                            this.state.logged_in &&
                            this.state.selected_tool == Tools.GET_LYRICS
                        ) ? (
                            <>
                                <RefreshButton onClick={() => { this.getCurrentTrack(this.state.access_token); }}>
                                    <img src="images/refresh-icon_white.svg" alt="Refresh Logo"/>
                                    <div>Refresh</div>
                                </RefreshButton>
                            </>
                        ) : null
                    }

                    <SongLyrics show={
                            (
                                this.state.logged_in && 
                                this.state.selected_tool === Tools.GET_LYRICS &&
                                this.state.currentlySongPlaying
                            ) ? true : false
                        }
                        trackInfo={this.state.current_song_info}
                    />

                    {
                        !(
                            this.state.logged_in && 
                            this.state.selected_tool === Tools.GET_LYRICS &&
                            this.state.currentlySongPlaying
                        ) ? [
                            (
                                this.state.logged_in &&
                                this.state.selected_tool === Tools.GET_LYRICS &&
                                !this.state.currentlySongPlaying 
                            ) ? (
                                <React.Fragment key="not-playing">
                                    <div style={{textAlign:"center"}}>Currently not playing a song</div>
                                </React.Fragment>
                            ) : null
                        ] : null
                    }

                    {
                        (
                            this.state.logged_in &&
                            this.state.selected_tool === Tools.SEARCH_IN_PLAYLISTS
                        ) ? (
                            <>
                                <PlaylistSearch/>
                            </>
                        ) : null
                    }

                </Main>
            </>
        );
    }

}