

// const localhostURL = 'http://gamecolozeum.com:8000/'; 

import moment from "moment";

const serverURL = 'https://PhotoStar.com/';
const hostURL = serverURL;

const futch = (url, opts={}, onProgress) => {
    console.log(url, opts)
    return new Promise( (res, rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers||{})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(e.target);
        xhr.onerror = rej;
        if (xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}


const requestCall = (fullUrl, method, body, headers, callBack, isResponseJson = true)=>{

    let reqParams = {
        method:method,
    }

    if(headers !== null){
        reqParams.headers = headers
    }

    if(body !== null){
        reqParams.body = JSON.stringify(body) 
    }
    // let fullUrl = isFullUrl ? subUrl : hostURL + subUrl;
    console.log(fullUrl)
    console.log('reqParams:', reqParams)
    if ( isResponseJson == false ){
        fetch(fullUrl).then(function(response) {
            console.log('response:', response)
            return response.text().then((text)=>{
                console.log('text:', text)
              callBack( text, null)
            });
          });
    }else{

        fetch(fullUrl, reqParams)
        .then(function(response) {
            console.log('response:', response)
            
            return response.json()
            
            
        }).then(function(data) {
            console.log(data)
            // if ( isResponseJson == true ){
                callBack(data, null)
            // }
            
        }).catch(function (err) {
            console.log('err', err)
            callBack(null, err)
        }).then(function(){
            console.log('final callback')
        });
    }
    


}

function BearerHeader(token){
    const header = {
        Authorization: 'Bearer ' + token
    }    
    return header
}




const formDataCall = (fullUrl, method, body, headers, callBack, isFullLink = false )=>{
    // let link = isFullLink ? subUrl : hostURL + subUrl
    let link = fullUrl
    futch(link, {
        method: method,
        body: body,
        headers:headers
    }, (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        console.log(progress);

    }).then(function (resJson){
        console.log('Here is response from server!>>>>>|||>>|:>');
       
        try{
            let res = JSON.parse(resJson.response)
            console.log('after parsing: ',res)
            callBack(res, null);
         }catch(exception){
             console.log(exception);
             callBack(null, exception);
         }

    }, (err) => {

        console.log('parsing err ',err)
        callBack(null, err);
        }
    );
}

const RestAPI = {

    fullUrl:(url)=>{
        return hostURL + url;
    },

    geoCodingFromLocationIQ(lat, lon){

        let myTokenInLocationIq = '79796c87ec4f44'; // from zyxm gmail account https://my.locationiq.com/

        let url = 'https://us1.locationiq.com/v1/reverse.php?key='+myTokenInLocationIq+'&lat='+lat+'&lon='+lon+'&format=json';

        return new Promise( ( resolve, reject)=>{
            fetch(url)
            .then(function(res) {    
                try{
                    let json = res.json();                    
                    return json;
                }catch (e) {
                    reject( e )
                }
            })
            .then(function(resJson) {
                resolve( resJson )        
            }, error=>{
                reject( error )
            })
        })
        
    },

    geoGoogleReverse(place_id, GoogleApiKey){

        let url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${GoogleApiKey}`;

        return new Promise( ( resolve, reject)=>{
            fetch(url)
            .then(function(res) {    
                try{
                    let json = res.json();                    
                    return json;
                }catch (e) {                    
                    reject( e )
                }    
            })
            .then(function(resJson) {
                resolve( resJson )        
            }, error=>{
                reject( error )
            })
        })
    },

    forgotPwd:(email)=>{

        let data = new FormData();
        data.append('email', email);
        return new Promise((resolve, reject)=>{
            formDataCall( 'api/forgotPwd', 'post', data, null, (res, err)=>{
                if ( err ){
                    reject( err )
                }else{
                    resolve( res )
                }
            })
        })
    },

    login(email, password){
      
        let data  = new FormData();
        data.append('email', email)
        data.append('password', password)
        
        if( global.expoPushToken && global.UUID ){
            
            data.append('token', global.expoPushToken )
            data.append('uuid', global.UUID)
        }   
        
        
        console.log(data)
        return new Promise( (resolve, reject)=>{

            formDataCall( 'api/login', 'post', data, null, (res, err)=>{
                if ( err ){
                    reject( err )
                }else{
                    resolve( res )
                }
            })           
        })        

    },

    
    checkToken(pushToken, UUID){
        
        
        let data = null;
        if( pushToken && UUID ){

            data = new FormData();
            data.append('token', pushToken)
            data.append('uuid', UUID)

        }else{

        }

        return new Promise( (resolve, reject)=>{
            if( !global.curUser || !global.curUser.token ) {
                reject('Empty Token');
                return 
            }
            formDataCall( 'api/checkToken', 'post', data, BearerHeader(global.curUser.token), (res, err)=>{
                
                if ( err ){
                    reject( err )
                }else{
                    resolve( res )
                }
            })           
        })        

    },

    register : (username, fName, lName, email, password, phoneNumber, selCityId, user_role_slug = "customer", isSocialSignup = false)=>{
   
        let data  = new FormData();
        data.append('name', username)
        data.append('email', email)
        data.append('password', password)
        data.append('first_name', fName)
        data.append('last_name', lName)
        data.append('phone_number', phoneNumber)
        data.append('user_role_slug', user_role_slug)
        data.append('city', selCityId)
        data.append('isSocialSignup', isSocialSignup == true ? 1 : 0)
        
        
        if( global.expoPushToken && global.UUID ){
            data.append('token', global.expoPushToken )
            data.append('uuid', global.UUID)
        }
        

        console.log(data)
        return new Promise( (resolve, reject)=>{

            formDataCall( 'api/register', 'post', data, null, (res, err)=>{
                if ( err ){
                    reject( err )
                }else{
                    resolve( res )
                }
            })           
        })  
    },

   


}

export default RestAPI;

