import React from "react";
import { CurrentTrackResponse, CurrentTrackStatus, getCurrentlyPlayingTrack, TrackInfoType } from "./API/getCurrentlyPlayingTrack";

import {redirectSpotifyLogin} from "./API/redirectSpotifyLogin";

import { 
    setAccessToken, 
    getPartsOfUrl, 
    AccessTokenDataType, 
    AccessTokenDataCookieType, 
    getAccessToken 
} from "./utils";

interface IProps{
}

interface IState{
    access_token:string;
    current_song_info:CurrentTrackResponse;
}

export class App extends React.Component<IProps, IState>{    
    constructor(props: IProps){
        super(props);

        this.state = {
            access_token:"",
            current_song_info:{
                status:-1
            }
        }
    }

    componentDidMount(){
        //Get token from cookies if exists
        let accessTokenData = getAccessToken();

        if(accessTokenData){
            console.log("Here is the good old(max 3600 secs) Token");
            let accessToken:AccessTokenDataCookieType = JSON.parse(accessTokenData);
            this.setState({access_token:accessToken.access_token});

            this.getCurrentTrack(accessToken.access_token);

        }else{
            console.log("No Token");
            //If url has hash(#), we hope it contains access_token
            if(window.location.hash){
                // Remove hash and split into parts url
                let accessTokenData:AccessTokenDataType = getPartsOfUrl(window.location.hash.substring(1)); 

                //Set access token to cookies
                setAccessToken(accessTokenData);
                window.location.href = "http://localhost:3000";
            }
            
            redirectSpotifyLogin("http://localhost:3000", false);
        }
    }

    getCurrentTrack = async (access_token:string) => {
        let trackInfo:CurrentTrackResponse = await getCurrentlyPlayingTrack(access_token);

        console.log(trackInfo);
    }

    render(){

        return (
            <>

            </>
        );
    }

}