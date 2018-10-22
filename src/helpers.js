export const clog = (s) => {
    console.log(s)
    return 0
}

export const authQuip = (tok,msg) => {
    if(tok == "12345678") {
        console.log(msg);
        return true;
    } else {
        return false;
    }
}