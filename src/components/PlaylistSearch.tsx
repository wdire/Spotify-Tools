import React from "react";
import { SearchBar } from "./PlaylistSearch.styles";

interface IProps{

}

interface IState{
    
}

export class PlaylistSearch extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
        }
    }
    // Note: Set a max amounth of results. 20 etc.
    render(){

        console.log();

        return( 
            <>
                <SearchBar>

                </SearchBar>
            </>
        );
    }
}