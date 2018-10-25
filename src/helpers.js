export const clog = (s) => {
    console.log(s);
    return 0;
};

export const authQuip = (tok,msg) => {
    if(tok == "12345678") {
        console.log(msg);
        return true;
    } else {
        return false;
    }
};

export const getToken = (head) => {
    var token = null;
    if(typeof head.authorization != "undefined") {
      var autharr = head.authorization.split(" ");
      token = autharr[autharr.length-1];
    }
    return(token);
};

export const getUser = (tok) => {
    var userObj = {};
    switch(tok) {
        case "qwerty123456":
            userObj.name = "jbalsamo";
            userObj.role = "Jedi Knight";
            userObj.valid = true;
            break;
        case "asdfgh123456":
            userObj.name = "ebremer";
            userObj.role = "Sith Lord";
            userObj.valid = true;
            break;
        case "zxcvbn123456":
            userObj.name = "tdiprima";
            userObj.role = "Republic Senator";
            userObj.valid = true;
            break;
        case "graphiql":
            userObj.name = "graphiql";
            userObj.role = "droid";
            userObj.valid = true;
            break;
        default:
    }
    return (userObj);
};