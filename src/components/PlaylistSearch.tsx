import React from "react";
import { SearchBar } from "./PlaylistSearch.styles";

import { AllPaylistsStatus, getAllPaylists } from "../API/getAllPaylists";
import { getAllTracksFromAllPlaylists, AllPlaylistDataWithTracksType } from "../API/getAllTracksFromPlaylists";
import { setPlaylistsData_storage, getPlaylistsData_storage, setPlaylistsDataLastTime_storage, getPlaylistsDataLastTime_storage } from "../utils";

interface IProps{
    access_token:string;
}

interface IState{
    
}

export class PlaylistSearch extends React.Component<IProps, IState>{
    allPlaylistsData:AllPlaylistDataWithTracksType[];

    constructor(props: IProps){
        super(props);

        this.allPlaylistsData = [];

        this.state = {
        }
    }

    async componentDidMount(){

        let playlistDataLastTime = await getPlaylistsDataLastTime_storage();
        
        if(playlistDataLastTime){

            let now = new Date().getTime();

            let diff = now - Number(playlistDataLastTime);

            // One week
            let time = 7 * 24 * 60 * 60 * 1000;

            // If one week passed
            if(diff > time){
                this.getAllPlaylistsWithAllTracks();
            }else{
                this.allPlaylistsData = await JSON.parse(await getPlaylistsData_storage() || "") || [];
            }

        }

        console.log(this.allPlaylistsData);
   
    }

    getAllPlaylistsWithAllTracks = async () => {
        let playlistsData = await getAllPaylists(this.props.access_token);

        if(playlistsData.status === AllPaylistsStatus.OK && playlistsData.playlistData){
            this.allPlaylistsData = await getAllTracksFromAllPlaylists(this.props.access_token, playlistsData.playlistData);

            console.log("Got playlist data");

            await setPlaylistsData_storage(this.allPlaylistsData).then(()=>{
                console.log("Setted playlists data to localstorage");
            });

            await setPlaylistsDataLastTime_storage(new Date());
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