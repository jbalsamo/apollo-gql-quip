import { validate } from "graphql";

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

export const validateToken = (url,token) => {
    /*
    fetch("https:\/\/vinculum.bmi.stonybrookmedicine.edu/listofimages/?_format=json",{'method':'GET','headers':{ 'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NDA5MjMzNzksImV4cCI6MTU0MDkyNjk3OSwiZHJ1cGFsIjp7InVpZCI6IjM1In19.HSvp5vug_NDJ4UCavb3_9T6etkHwaOKai9d8VTJOYWOxwSD0BM3m_gRKSEsYgtR1QnLmQKp568zD2VKMAPhSFH6YUMzOBX0UTghqKrSx9LqcMOQVM14T6ccWi5XhGlLSC-JHH4OqybjWK1RbI2NAJGsraIk3MnN7uBqkTbp-JB2eyXAMVHAWJ4xMrIfuOS3l_GV-govVhEQdznlgnQHiRQfAjgAbmp511vHzS5W3AU6v2SJeQ1SbJbKEHchYfqlwSTXVqO_G_B2BsG4tgnGHjslTt6Y5Lv4Swy-uD_dP_NjCuqP6C20R6P-j6sNdyE_WYhTwdZJPHXkWnsVZq9-N0A' }, 'mode':'cors'}).then( (response) => { return(response.json()); }).then((data)=>{data.map((rcd)=>{console.log({'node_num':rcd.field_collection[0].url.split('\/').slice(-1)[0], 'title': rcd.title[0].value ,'status':rcd.status[0].value})})})
    */
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