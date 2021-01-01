import styled, { css } from 'styled-components';

export const SearchBarInput = styled.input`
    outline:none;
    width:100%;
    height:100%;
    padding-left:12px;
    border:none;
    background:#424242;
    font-size:16px;
    color:#fff;
    border-radius:0;
`;

export const SearchBar = styled.div`
    display:flex;
    margin:0 auto;
    margin-top:30px;
    width:330px;
    height:40px;
    margin-bottom:30px;
    border-radius:4px;
    overflow:hidden;
`;

export const SearchBarButton = styled.div`
    min-width:40px;
    width:40px;
    height:40px;
    background:#545454;
    padding:8px;
    cursor:pointer;

    img{
        user-select:none;
        pointer-events:none;
        max-width: 100%;
        display: block;
        width: 100%;
    }
`;

export const SearchResults = styled.div`
    display:flex;
    flex-direction: column;
`;

export const SearchResultItem = styled.div`
    width:100%;
    display:flex;
    align-items:center;
    padding:12px;
    border-radius:8px;
    overflow:hidden;
    background:#424242;
    margin-bottom:15px;
`;

export const SearchResultItemAlbumImage = styled.div`
    width:52px;
    height:52px;
    margin-right:10px;
    min-width: 52px;

    img{
        height:auto;
        max-width:100%;
        display:block;
    }

    @media (max-width:450px){
        width:44px;
        height:44px;
        min-width: 44px;
    }
`;

export const SearchResultItemDetails = styled.div`
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding-right:5px;
`;

export const SearchResultItemName = styled.div`
    display:flex;
    flex-direction:column;
`;

export const SearchResultItemTrackName = styled.a`
    display:block;
    font-size:16px;
    color:#fff;
    text-decoration:underline;
    cursor:pointer;
`;

export const SearchResultItemBandName = styled.div`
    font-size:14px;
    color:#aaa;
`;

export const SearchResultItemPlaylistName = styled.div`
    font-size:14px;
    color:#aaa;
`;


export const SearchWrapper = styled.div<{show:boolean}>`
    ${ props => (!props.show) && css`
        display:none;
    `}
    width:500px;
    max-width:100%;
    padding:0 5px;

    @media (max-width:450px){
        ${SearchResultItemTrackName}{
            font-size:14px;
        }

        ${SearchResultItemBandName}{
            font-size:13px;
        }

        ${SearchResultItemPlaylistName}{
            font-size:13px;
        }

    }

`;


const loading_borderSize = 3;
const loading_size = 28;

export const Loading = styled.div`
    justify-content:center;
    display: flex;
    align-items:center;
    width:100%;
    height: ${loading_size + loading_borderSize * 2}px;

    &:before {
        content: " ";
        display: block;
        width: ${loading_size}px;
        margin-right:13px;
        height: ${loading_size}px;
        border-radius: 50%;
        border: ${loading_borderSize}px solid #fff;
        border-color: #fff #fff #fff transparent;
        animation: loading 1.2s linear infinite;
    }

    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;