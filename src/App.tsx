import React from "react";

import {redirectSpotifyLogin} from "./API/redirectSpotifyLogin";
import { getCookie, getPartsOfUrl } from "./utils";

interface IProps{
}

interface IState{
}

export class App extends React.Component<IProps, IState>{    
    constructor(props: IProps){
        super(props);

        this.state = {
        }
    }

    componentDidMount(){
        
    }

    render(){

        return (
            <>

            </>  
        );
    }

}