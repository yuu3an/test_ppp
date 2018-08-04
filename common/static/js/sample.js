var map;
var service;
var lat;
var lng;
var zoom;
//現在位置取得

// マップの初期設定
function initialize() {
   // Mapクラスのインスタンスを作成
    navigator.geolocation.getCurrentPosition(

       // [第1引数] 取得に成功した場合の関数
       function( position )
       {
           // 取得したデータの整理
           var data = position.coords ;

           // データの整理
           lat = data.latitude ;
           lng = data.longitude ;
           zoom = 18;
           mapTypeId : google.maps.MapTypeId.ROADMAP
           var alt = data.altitude ;
           var accLatlng = data.accuracy ;
           var accAlt = data.altitudeAccuracy ;
           var heading = data.heading ;            //0=北,90=東,180=南,270=西
           var speed = data.speed ;

               // HTMLへの書き出し
               document.getElementById( 'result' ).innerHTML = '<dl><dt>緯度</dt><dd>' + lat + '</dd><dt>経度</dt><dd>' + lng + '</dd><dt>高度</dt><dd>' + alt + '</dd><dt>緯度、経度の精度</dt><dd>' + accLatlng + '</dd><dt>高度の精度</dt><dd>' + accAlt + '</dd><dt>方角</dt><dd>' + heading + '</dd><dt>速度</dt><dd>' + speed + '</dd></dl>' ;

               // 位置情報
               var latlng = new google.maps.LatLng( lat , lng ) ;

               // Google Mapsに書き出し
               map = new google.maps.Map( document.getElementById( 'map-canvas' ) , {
                   zoom: zoom ,                // ズーム値
                   center: latlng ,        // 中心座標 [latlng]
                   mapTypeId: google.maps.MapTypeId.ROADMAP
               } ) ;

               // マーカーの新規出力
               new google.maps.Marker( {
                   map: map ,
                   position: latlng ,
               } ) ;
       } ,
       // [第2引数] 取得に失敗した場合の関数
        function( error )
        {
            // エラーコード(error.code)の番号
            // 0:UNKNOWN_ERROR                原因不明のエラー
            // 1:PERMISSION_DENIED            利用者が位置情報の取得を許可しなかった
            // 2:POSITION_UNAVAILABLE        電波状況などで位置情報が取得できなかった
            // 3:TIMEOUT                    位置情報の取得に時間がかかり過ぎた…

            // エラー番号に対応したメッセージ
            var errorInfo = [
                "原因不明のエラーが発生しました…。" ,
                "位置情報の取得が許可されませんでした…。" ,
                "電波状況などで位置情報が取得できませんでした…。" ,
                "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
            ] ;

            // エラー番号
            var errorNo = error.code ;

            // エラーメッセージ
            var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;

            // アラート表示
            alert( errorMessage ) ;

            // HTMLに書き出し
            document.getElementById("result").innerHTML = errorMessage;
        } ,

        // [第3引数] オプション
        {
            "enableHighAccuracy": false,
            "timeout": 8000,
            "maximumAge": 2000,
        }
    );
}

// 検索結果を受け取る
function Result_Places(results, status){
   // Placesが検家に成功したかとマうかをチェック
   if(status == google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0; i < results.length; i++) {
           // 検索結果の数だけ反復処理を変数placeに格納
           var place = 5;
           createMarker({
                text : place.name,
                position : place.geometry.location
           });
       }
   }
}
// 入力キーワードと表示範囲を設定
function SearchGo() {
//    var initPos = new google.maps.LatLng(lat,lng);
//    var mapOptions = {
//        center : initPos,
//        zoom: zoom,
//        mapTypeId : google.maps.MapTypeId.ROADMAP
//    };
   // #map_canva要素にMapクラスの新しいインスタンスを作成
 //  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
   service = new google.maps.places.PlacesService(map);
   // input要素に入力されたキーワードを検索の条件に設定
   var myword = document.getElementById("searchGoBox");
   var request = {
       query : myword.value,
       radius : 5000,
       location : map.getCenter()
   };

   service.textSearch(request, result_search);
}

// 検索の結果を受け取る
function result_search(results, status) {

   var bounds = new google.maps.LatLngBounds();
   for(var i = 0; i < 5; i++){
       createMarker({
            position : results[i].geometry.location,
            text : results[i].name,
            map : map
        });
       bounds.extend(results[i].geometry.location);
   }
   map.fitBounds(bounds);
}

// 該当する位置にマーカーを表示
function createMarker(options) {
   // マップ情報を保持しているmapオブジェクトを指定
   options.map = map;
   // Markcrクラスのオブジェクトmarkerを作成
   var marker = new google.maps.Marker(options);
   // 各施設の吹き出し(情報ウインドウ)に表示させる処理
   var infoWnd = new google.maps.InfoWindow();
   infoWnd.setContent(options.text);
   // addListenerメソッドを使ってイベントリスナーを登録
   google.maps.event.addListener(marker, 'click', function(){
       infoWnd.open(map, marker);
   });
   return marker;
}

function GetAPI() {
    $('#result').val('成功');
    if($('#sports').val() == 'スポーツ') {
        $('#result').val('サブカテを選択してください');
     }
   $.ajax({
       'url':'../search/' + $('#sports').val(),
       'type':'GET',
       'data':{},
       'dataType':'json',
       'success':function(response){
           $('#result').val(response.category_name);
       },
   });
   <!--$('#result').val('失敗');-->
   return false;
}

function SearchSubCategory() {
   $.ajax({
       'url':'../radio_search/' + $('#radio').val(),
       'type':'GET',
       'data':{},
       'dataType':'json',
       'success':function(response){
           $('#result2').val(
           response[0].sub_category_name + ':' +
           response[1].sub_category_name + ':' +
           response[2].sub_category_name);
       },
   });
   $('#result2').val('失敗');
   return false;
}

// ページ読み込み完了後、Googleマップを表示
google.maps.event.addDomListener(window, 'load', initialize);