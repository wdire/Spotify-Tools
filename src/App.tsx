import React from "react";

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
}

export class App extends React.Component<IProps, IState>{    
    constructor(props: IProps){
        super(props);

        this.state = {
            access_token:""
        }
    }

    componentDidMount(){
        let accessTokenData = getAccessToken();
        if(accessTokenData){
            console.log("Here is the good old(max 3600 secs) Token");
            let accessToken:AccessTokenDataCookieType = JSON.parse(accessTokenData);
            this.setState({access_token:accessToken.access_token});
            
        }else{
            console.log("No Token");
            if(window.location.hash){
                let accessTokenData:AccessTokenDataType = getPartsOfUrl(window.location.hash.substring(1)); 

                setAccessToken(accessTokenData);
                window.location.href = "http://localhost:3000";
            }
            
            redirectSpotifyLogin("http://localhost:3000", false);
        }
    }

    render(){

        return (
            <>
                {this.state.access_token}
            </>
        );
    }

}