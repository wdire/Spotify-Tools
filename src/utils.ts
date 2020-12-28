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