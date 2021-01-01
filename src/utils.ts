import { AllPlaylistDataWithTracksType } from "./API/getAllTracksFromPlaylists";

export const getPartsOfUrl = (url:string) => {
    return url.split("&").reduce(function(initial:any, item) {
        if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
};

export const getCookie = (cname:string) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = document.cookie ? decodedCookie.split(';') : [];
    for(var i = 0; i < ca.length; i++) {
    	var c = ca[i];
    	while (c.charAt(0) == ' ') {
    		c = c.substring(1);
		}
		  
    	if (c.indexOf(name) == 0) {
        	return c.substring(name.length, c.length);
      	}
    }
    return "";
}

export const setCookie = (cname:string, cvalue:any, exsecs:number) => {
    var d = new Date();
    d.setTime(d.getTime() + (exsecs * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export type AccessTokenDataCookieType = {
	access_token:string;
}

export type AccessTokenDataType = {
    access_token:string;
    token_type:string;
    expires_in:number;
}

const spotify_access_token = "spotify_access-token";

export const setAccessToken = (accessTokenData:AccessTokenDataType) => {

	let tokenData = {
		access_token:accessTokenData.access_token,
		//endTime:new Date().getTime() + (accessTokenData.expires_in * 1000)
	};

    setCookie(spotify_access_token, JSON.stringify(tokenData), accessTokenData.expires_in);
    setLoggedIn();
}

export const getAccessToken = () => {
	return getCookie(spotify_access_token);
}

const spotify_logged_in = "spotify_logged-in";

export const setLoggedIn = () => {
    setCookie(spotify_logged_in, true, (60 * 60 * 24 * 30)); // Keep for 30 days
}

export const checkLoggedIn = () => {
    return getCookie(spotify_logged_in);
}


const asyncLocalStorage = {
    setItem: function (key:string, value:string) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key:string) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    }
};

const spotify_playlist_data = "spotify_playlist-data";

export const setPlaylistsData_storage = (playlistsData:AllPlaylistDataWithTracksType[]) =>{
    return asyncLocalStorage.setItem(spotify_playlist_data, JSON.stringify(playlistsData));
}

export const getPlaylistsData_storage = () =>{
    return asyncLocalStorage.getItem(spotify_playlist_data);
}

const spotify_playlists_data_last_time = "spotify_playlist-data_last-time";

export const setPlaylistsDataLastTime_storage = (date:Date) =>{
    return asyncLocalStorage.setItem(spotify_playlists_data_last_time, date.getTime().toString());
}

export const getPlaylistsDataLastTime_storage = () =>{
    return asyncLocalStorage.getItem(spotify_playlists_data_last_time);
}

export const doesArraysHasMatch = (arr1:Array<string>, arr2:Array<string>) => {
    for(var i in arr1) {   
        if(arr2.indexOf(arr1[i]) > -1){
            return true;
        }
    }

    return false;
};

export const removeMatchesFromArray = (originalArray:Array<string>, arr2:Array<string>) => {
    let returnArr = [];
    for(var i in originalArray) {   
        if(arr2.indexOf(originalArray[i]) === -1){
            returnArr.push(originalArray[i]);
        }
    }

    return returnArr;
}