import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html{
        height:100%;
    }

    body{
        font-family:"Roboto", Arial, Helvetica, sans-serif;
        margin:0;
        padding:0;
        color:#fff;
        background:#282828;
    }

    *{
        box-sizing:border-box;
    }
`;

export const Main = styled.div`
    margin:0 auto;
    max-width:100%;
    width:max-content;
    margin-top:10px;
    padding: 10px;
    padding-bottom:80px;

    h1{
        font-weight:lighter;
        text-align:center;
        margin-bottom:0;
        font-size:32px;

        span{
            font-weight:bold;
        }
    }

`;

export const ToolSelect = styled.div`
    margin:0 auto;
    display:flex;
    border-radius:7px;
    margin-top:15px;
    margin-bottom:20px;
    overflow:hidden;
    border:1px solid #fff;
    width: max-content;
`;

export const ToolSelectItem = styled.div<{selected:boolean}>`
    //border:1px solid red;
    padding:8px 20px;
    position:relative;
    transition:background 0.28s;
    cursor:pointer;
    font-size:16px;

    &:first-child{
        &:after{
            content:"";
            width:1px;
            height:70%;
            position:absolute;
            z-index:20;
            top:50%;
            right:-0.5px;
            transform:translateY(-50%);
            background:#fff;
        }
    }

    &:hover{
        background:rgba(255,255,255,.18);
    }

    ${ props => (props.selected) && css`
        background:rgba(29,185,84,0.8)!important;
    `}

`;

export const LoginButton = styled.button`
    display:flex;
    align-items:center;
    color:#fff;
    font-size:14px;
    border-radius:6px;
    padding:9px 17px;
    border:none;
    background:rgba(29,185,84);
    outline:none;
    cursor:pointer;
    transition:background 0.33s;
    margin:0 auto;
    margin-top:22px;

    &:hover{
        background:rgba(40,160,80);
    }

    img{
        height:20px;
        width:20px;
        margin-right:6px;
        pointer-events:none;
    }

`;

export const RefreshButton = styled.button`
     display:flex;
    align-items:center;
    color:#fff;
    font-size:14px;
    border-radius:6px;
    padding:7px 14px;
    padding-left:10px;
    border:none;
    background:rgba(29,185,84);
    outline:none;
    cursor:pointer;
    transition:background 0.33s;
    margin:0 auto;
    margin-top:22px;
    margin-bottom:25px;
    font-size:16px;

    &:hover{
        background:rgba(40,160,80);
    }

    img{
        height:24px;
        width:24px;
        margin-right:6px;
        pointer-events:none;
    }
`;
