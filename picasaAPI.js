// var oauth2 = require('./oauth2.js');
var fs = require('fs');
var Picasa = require('picasa');
var picasa = new Picasa();

//var token = oauth2.refreshAccessToken(client_id, client_secret, refresh_token);
// console.log(token);
// refreshAccessToken();
// mediaUpload("D:/winlib/Pictures/Camera Roll/IMG_20170210_145423.jpg", token.access_token);



/* ------- 함수 정의 ----------*/
function getAlbumList(){
  var args = {
    headers: {
      "Gdata-version" : 2,
      "Authorization" : 'Bearer '+ project_key.access_token
    }
  };
  client.get(
    'https://picasaweb.google.com/data/feed/api/user/default',
    args,
    function (data, response){
      // console.log(data.toString('utf8'));
      if(response.statusCode==200)
      {
        console.log(data.toString('utf-8'));
      }
      else
      {
        console.log('앨범 요청 URL 생성 실패');
      }
    }
  );
}

function checkFiletype(mediaPath){
  // console.log(mediaPath.length);
  for(i = mediaPath.length - 1; i>=0; i--)
  {
    if(mediaPath[i] == '.')
      break;
  }
  if(mediaPath.length - i < 5)
    return mediaPath.substring(i+1);
}

function contentType(mediaPath){
  var type = 'image/';
  var filetype = checkFiletype(mediaPath);
  switch(filetype){
    case 'jpg':
    case 'jpeg':
      type += 'jpeg';
      break;
    case 'bmp':
      type += 'bmp';
      break;
    case 'gif':
      type += 'gif';
      break;
    case 'png':
      type += 'png';
      break;
    default :
      type = 'err';
  }
  return type;
}

// sync 함수
function mediaUpload(mediaPath, access_token, public_album_id, filename){
  var mediaBinary = fs.readFileSync(mediaPath);
  // 미디어 확장자 체크.
  var media = {
    title : filename,  // 파일명 입력
    summary : '',  // 파일 태그 확인
    contentType : contentType(mediaPath), //확장자 입력
    binary : mediaBinary
  };
  if(media.contentType == 'err')
  {
    console.log('지원하지 않는 파일 확장자');
    return -1;
  }

  var sync = true;
  var uploadedMedia = null;
  picasa.postPhoto(access_token, public_album_id, media,
    function (err, media){
      // console.log(err, media);
      uploadedMedia = media;
      sync = false;
      //단축 URL생성
      //DB에 파일 정보 입력
      //미디어 삭제
      //단축 URL 리턴

      // media 객체 예시.
      //{ id: '6487564294855406018',
      // album_id: '6487550612530426321',
      // access: 'protected',
      // width: '100',
      // height: '100',
      // size: '2002',
      // checksum: '',
      // timestamp: '1510503770082',
      // image_version: '81',
      // commenting_enabled: 'true',
      // comment_count: 0,
      // content:
      //  { type: 'image/png',
      //    src: 'https://lh3.googleusercontent.com/-TTwRvV7sK5I/Wgh1WoRdMcI/AAAAAAAAAFE/SYBKTxU9Ie0OMYXD_1DKy106rDSiv_C8wCHMYCw/title' },
      // title: 'title',
      // summary: 'summery' }
    }
  );
  while(sync){require('deasync').sleep(10);}
  return uploadedMedia;
}


exports.mediaUpload = mediaUpload;
