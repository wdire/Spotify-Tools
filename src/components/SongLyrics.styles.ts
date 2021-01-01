import styled, { css } from 'styled-components';

export const TrackInfo = styled.div`
    display:flex;
    justify-content: center;
    //position: sticky;
    //top: 0px;
    padding: 10px 0;
    background: #282828;
    height:max-content;
    max-width: 480px;
    margin: 0 auto;
`;

export const TrackAlbumImage = styled.div`
    width:100px;
    height:100px;
    border-radius:8px;
    overflow:hidden;
    //border:1px solid #505050;
    margin-right:12px;

    img{
        max-width:100%;
    }
`;

export const TrackDetails = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    color:#fff;
    font-size:16px;
`;

export const TrackName = styled.div`
    
`;

export const TrackBrand = styled.div`
    font-size:14px;
    color:#888;
    margin-top:4px;
`;

export const Lyrics = styled.div`
    line-height:1.6;
    font-size:16px;
`;

export const LyricsWrapper = styled.div`
    max-width:500px;
    margin-top:25px;
    text-align:center;

    @media (max-width:500px){
        ${Lyrics}{
            font-size:14px;
        }
    }

`;

export const Desc = styled.div`
    line-height:1.35em;

    a{
        color:#1db954;
    }
`;

export const TrackWrapper = styled.div<{show:boolean}>`
    ${ props => (!props.show) && css`
        display:none;
    `}
`;