//
//  구글 OAuth2를 연동하기위해 nodejs가 client역할을 수행하는 코드
//
//
// https://github.com/danwrong/restler
// get요청시에 data와 response가 구분되지 않고 깨진다.
// var restler = require('restler');

// https://www.npmjs.com/package/node-rest-client
// post가 제대로 안들어가서 get에만 사용한다.
// var Client = require('node-rest-client').Client;
// var node_rest_client = new Client();
var Client = require('node-rest-client').Client;
var node_rest_client = new Client();
var restler = require('restler');

// 구글 계쩡에 데이터 사용 권한을 달라는 URL을 만들어준다.
// 계정당 최초 한번 실행해 접속해 code를 받으면 된다.
function requestAuthURL(client_id, redirect_uri, scopes){
  var redirectURL;
  node_rest_client.get(
    'https://accounts.google.com/o/oauth2/v2/auth'
    + '?scope=' + scopes
    + '&access_type=offline'
    + '&include_granted_scopes=true'
    + '&state=state_parameter_passthrough_value'
    + '&redirect_uri=' + redirect_uri
    + '&response_type=code'
    + '&client_id=' + client_id,
    function (data, response){
      // console.log(data.toString('utf8'));
      if(response.statusCode==200)
      {
        console.log(response.responseUrl);
        redirectURL = response.responseUrl;
      }
      else
      {
        console.log('권한 요청 URL 생성 실패');
      }
    }
  );
  return redirectURL;
}

// reqyestAuthURL에서 받아온 code를 사용해 최초로 access_token을 받아온다.
// 계정에 권한이 허용되고 최초 요정시에만 refresh_token이 같이 나오고,
// 그 이후로는 나타나지 않아 권한을 삭제후 다시 요청해야 하므로 주의.
// 타사 앱 권한 관리는 https://myaccount.google.com/permissions 여기서
// 액세스 토큰은 3600초가 지나면 만료된다.
function requestAccessToken(client_id, client_secret, redirect_uri, access_code) {
  var token;
  restler.post(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      data:{
        scope : '',
        code : access_code,
        redirect_uri : redirect_uri,
        client_id : client_id,
        client_secret : client_secret,
        grant_type : 'authorization_code'
      },
    }
  ).on('complete',function(data,response){
    if(response.statusCode != 200)
    {
      console.log('액세스 토큰 요청 실패');
    }
    console.log(data);
    token = data;
  });
  return token;
}

// 엑세스 토큰을 갱신시킨다.
function refreshAccessToken(client_id, client_secret, refresh_token, callback){
  var token = null;
  var sync = true;
  restler.post(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      data:{
        refresh_token : refresh_token,
        client_id : client_id,
        client_secret : client_secret,
        grant_type : "refresh_token"
      },
    }
  ).on('complete',function(data,response){
    // console.log(data);
    token = data;
    sync = false;
    // console.log(response);
  });
  while(sync){require('deasync').sleep(10);}
  return token;
}


exports.requestAuthURL = requestAuthURL;
exports.requestAccessToken = requestAccessToken;
exports.refreshAccessToken = refreshAccessToken;
