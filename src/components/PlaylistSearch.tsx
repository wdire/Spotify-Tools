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

    // Note: Set a max amounth of search results. 20 etc.
    // Logo Idea: Music icon with a tool icon passed through, or music icon logo with around cogwheel
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