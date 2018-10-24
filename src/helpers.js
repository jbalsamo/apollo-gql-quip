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

export const getUser = (tok) => {
    user = null;
    switch(tok) {
        case "qwerty12345":
            user = "jbalsamo";
            break;
        case "asdfgh12345":
            user = "ebremer";
            break;
        case "zxcvbn12345":
            user = "tdiprima";
            break;
        case "graphiql":
            user = "graphiql";
            break;
        default:
    }
    return ({ 'user': {'name':user,'role':"admin"}});
};