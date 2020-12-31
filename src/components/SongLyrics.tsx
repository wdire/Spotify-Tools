import React from "react";
import { TrackInfoType } from "../API/getCurrentlyPlayingTrack";
import { getSongLyrics, LyricsReturn, LyricsStatus } from "../API/getSongLyrics";
import { Desc, Lyrics, LyricsWrapper, TrackAlbumImage, TrackBrand, TrackDetails, TrackInfo, TrackName, TrackWrapper } from "./SongLyrics.styles";

interface IProps{
    trackInfo:TrackInfoType;
    show:boolean;
}

interface IState{
    lyrics:string;
    desc:string;
    loading:boolean;
    currTrackInfo:TrackInfoType;
}

export class SongLyrics extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            lyrics:"",
            desc:"",
            loading:true,
            currTrackInfo:{
                name:"",
                album_image:"",
                artist:""
            }
        }
    }

    componentWillReceiveProps(){
        if(this.state.currTrackInfo.name !== this.props.trackInfo.name){
            this.getLyricsData();
            this.setState({loading:true});
            this.setState({lyrics:""});
        }
    }

    componentDidMount(){
        console.log(this.state.lyrics);
        if(this.state.currTrackInfo.name !== this.props.trackInfo.name){
            this.getLyricsData();
        }
    }

    getLyricsData = async () => {

        this.setState({currTrackInfo:this.props.trackInfo});

        let lyricsData:LyricsReturn = await getSongLyrics(this.props.trackInfo.name, this.props.trackInfo.artist);

        if(lyricsData.status === LyricsStatus.OK && lyricsData.lyrics){
            this.setState({lyrics:lyricsData.lyrics.split(/\r?\n/).join("<br>")});
            this.setState({desc:""});
            this.setState({loading:false});
        }else if(lyricsData.status == LyricsStatus.NO_LYRICS_FOUND){
            let searchQuery = "https://www.google.com/search?q=" + this.props.trackInfo.artist.split(" ").join("%20") + " " + this.props.trackInfo.name.split(" ").join("%20") + " lyrics";
            this.setState({desc:`Couldn't find lyrics of this song. <a href="${searchQuery}" target="_blank">Try Google :)</a>`});
            this.setState({lyrics:""});
            this.setState({loading:false});
        }else{
            let searchQuery = "https://www.google.com/search?q=" + this.props.trackInfo.artist.split(" ").join("%20") + " " + this.props.trackInfo.name.split(" ").join("%20") + " lyrics";
            this.setState({desc:`An unknown error occurred at the moment, could be due to too many request. Try again later or <a href="${searchQuery}" target="_blank">Try Google :)</a>`});
            this.setState({lyrics:""});
            this.setState({loading:false});
        }

    }

   
    render(){

        return (
            <>
                <TrackWrapper show={this.props.show}>
                
                    <TrackInfo>
                        <TrackAlbumImage>
                            <img src={this.props.trackInfo.album_image} alt="Album Image"/>
                        </TrackAlbumImage>
                        <TrackDetails>
                            <TrackName>{this.props.trackInfo.name}</TrackName>
                            <TrackBrand>{this.props.trackInfo.artist}</TrackBrand>
                        </TrackDetails>
                    </TrackInfo>

                    <LyricsWrapper>

                        {
                            this.state.loading ? (
                                <>
                                    Yükleniyor..
                                </>
                            ) : null
                        }

                        {
                            this.state.lyrics ? (
                                <Lyrics key="lyrics" dangerouslySetInnerHTML={{__html:this.state.lyrics}}>
                                    
                                </Lyrics>
                            ) : [
                                this.state.desc ? (
                                    <Desc key="song_desc" dangerouslySetInnerHTML={{__html:this.state.desc}}></Desc>
                                ) : null
                            ]
                        }
                    </LyricsWrapper>
                </TrackWrapper>
            </>
        );
    }
}