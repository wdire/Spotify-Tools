import React, { JSXElementConstructor, ReactElement } from "react";
import { Loading, SearchBar, SearchBarButton, SearchBarInput, SearchResultItem, SearchResultItemAlbumImage, SearchResultItemBandName, SearchResultItemDetails, SearchResultItemName, SearchResultItemPlaylistName, SearchResultItemTrackName, SearchResults, SearchWrapper } from "./PlaylistSearch.styles";

import { AllPaylistsStatus, getAllPaylists } from "../API/getAllPaylists";
import { getAllTracksFromAllPlaylists, AllPlaylistDataWithTracksType } from "../API/getAllTracksFromPlaylists";
import { setPlaylistsData_storage, getPlaylistsData_storage, setPlaylistsDataLastTime_storage, getPlaylistsDataLastTime_storage, doesArraysHasMatch, removeMatchesFromArray } from "../utils";
import { TrackInfoType } from "../API/getCurrentlyPlayingTrack";

import fuzzball from "fuzzball";

type TrackSearchResultType = {
    playlist_name:string;
    trackInfo:TrackInfoType;
    score:number;
}

interface IProps{
    access_token:string;
    show:boolean;
}

interface IState{
    searchResults:any;
    playlistsLoaded:boolean;
    searchingPlaylists:boolean;
}

export class PlaylistSearch extends React.Component<IProps, IState>{
    allPlaylistsData:AllPlaylistDataWithTracksType[];
    searchInput:React.RefObject<HTMLInputElement>;

    constructor(props: IProps){
        super(props);

        this.searchInput = React.createRef<HTMLInputElement>();

        this.allPlaylistsData = [];

        this.state = {
            searchResults:"",
            playlistsLoaded:false,
            searchingPlaylists:false
        }
    }

    async componentDidMount(){

    }

    async componentWillReceiveProps(nextProps:any){


        if(nextProps.show){
            let playlistDataLastTime = await getPlaylistsDataLastTime_storage();
        
            if(playlistDataLastTime){

                let now = new Date().getTime();

                let diff = now - Number(playlistDataLastTime);

                // One week
                let time = 7 * 24 * 60 * 60 * 1000;

                // If one week passed
                if(diff > time){
                    this.getAllPlaylistsWithAllTracks().then(()=>{
                        this.setState({playlistsLoaded:true});
                    });
                }else{
                    this.allPlaylistsData = await JSON.parse(await getPlaylistsData_storage() || "") || [];
                    this.setState({playlistsLoaded:true});
                }
            }else{
                this.getAllPlaylistsWithAllTracks().then(()=>{
                    this.setState({playlistsLoaded:true});
                });
            }
        }
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

    searchTrackInPlaylists = (query:string, maxResults:number = 30):TrackSearchResultType[] => {
        if(this.allPlaylistsData){

            //let queryParts = query.trim().toLowerCase().split(" ");

            let skipWords = ["the"];
            
            const limitScore = 60;

            //if(queryParts.length > 1){
                //queryParts = removeMatchesFromArray(queryParts, skipWords);
            //}

            let results:TrackSearchResultType[] = [];

            // console.log("Start");

            for(let i = 0; i < this.allPlaylistsData.length; i++){  

                let currP = this.allPlaylistsData[i];

                for(let k = 0; k < currP.all_tracks.length; k++){

                    let currT = currP.all_tracks[k];

                    let trackParts = [...currT.name.toLowerCase().split(" ")].concat([...currT.artist.toLowerCase().split(" ")]);

                    let trackScore = fuzzball.token_sort_ratio(query, currT.name);
                    let artistScore = fuzzball.token_sort_ratio(query, currT.artist);
                    let fullNameScore = fuzzball.token_sort_ratio(query, (currT.name + " " + currT.artist));

                    if(trackScore > limitScore || artistScore > limitScore || fullNameScore > limitScore){
                        results.push({
                            playlist_name:currP.playlist_name,
                            trackInfo:currT,
                            score:Math.max(trackScore, artistScore, fullNameScore)
                        })
                    }

                }
            }

            //console.log("End");

            results = results.sort((a, b) => (b.score - a.score)).slice(0, maxResults);

            return results;

        }else{
            return [];
        }
    }

    writeSearchResults = (results:TrackSearchResultType[]) => {
        
        return results.map((e, i)=>{
            return (
                <SearchResultItem key={i+"_"+e.trackInfo.name+"_"+e.playlist_name}>
                    <SearchResultItemAlbumImage>
                        <img src={e.trackInfo.album_image} alt="Mr. Brightside Album Image"/>
                    </SearchResultItemAlbumImage>
                    <SearchResultItemDetails>
                        <SearchResultItemName>
                            <SearchResultItemTrackName href={e.trackInfo.trackUrl} target={"_blank"}>{e.trackInfo.name}</SearchResultItemTrackName>
                            <SearchResultItemBandName>{e.trackInfo.artist}</SearchResultItemBandName>
                        </SearchResultItemName>
                        <SearchResultItemPlaylistName>{e.playlist_name}</SearchResultItemPlaylistName>
                    </SearchResultItemDetails>
                </SearchResultItem>
            );
        });

    }

    handleSearchButtonClick = () => {
        if(this.searchInput.current && this.searchInput.current.value){
            this.setState({searchingPlaylists:true});
            let query = this.searchInput.current.value;
            let results = this.writeSearchResults(this.searchTrackInPlaylists(query));
            this.setState({searchingPlaylists:false});
            this.setState({searchResults:results});
        }
    }

    handleSearchInputEnter = (e:React.KeyboardEvent<HTMLInputElement>) => {
        let key = e.code || e.key || e.which || e.keyCode;

        if(key === "Enter" || key === 13){
            this.handleSearchButtonClick();
        }
    }

    // Note: Set a max amounth of search results. 20 etc.
    // Logo Idea: Music icon with a tool icon passed through, or music icon logo with around cogwheel
    render(){

        return( 
            <>
                <SearchWrapper show={this.props.show}>

                    {this.state.playlistsLoaded ? (
                        <SearchBar>
                            <SearchBarInput onKeyDown={(e)=>{this.handleSearchInputEnter(e)}} ref={this.searchInput} placeholder={"Search in All Playlists.."}></SearchBarInput>
                            <SearchBarButton onClick={()=>{this.handleSearchButtonClick()}}>
                                <img src="images/search-icon_white.svg" alt="Search Icon"/>
                            </SearchBarButton>
                        </SearchBar>
                    ) : null}

                    <SearchResults>

                        {this.state.playlistsLoaded ? [
                            !this.state.searchingPlaylists ? (
                                this.state.searchResults
                            ) : (
                                <Loading>Searching</Loading>
                            )
                        ] : (
                            <Loading>Playlists Loading</Loading>
                            
                        )}

                    </SearchResults>
                </SearchWrapper>
            </>
        );
    }
}