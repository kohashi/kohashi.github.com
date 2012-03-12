
// backbone.jsを使うよ！

$(function(){
	window.App ={Models:{}, Collections:{}, Views:{}, Routers:{} };//名前空間的な？
	
	//----------------------------------------------------------------------------------
	// *****  M o d e l  *****
	App.Models.PropModel = Backbone.Model.extend({
		initialize: function () {
			//初期化時じゃないとセットできない値なんかを
			this.set('name', 'object_' + this.cid);
			
			//初期化時にModelのイベントバインディングを行う。生成後でもいいんだけどね。自動ではやってくれないよ
			//this.on('change', this.changeFunc)
			this.on('error',  this.errorFunc)
		},
		defaults :{ //Modelのデフォルト値を設定します
			alpha : 1,
			display : true,
			frame : 0
		},
		destroy : {//破棄時のイベント。勝手にバインディングをされるよ。
			
		},
		validate : function(attr){//validateメソッドを作ると、値の入力を拒否できるよ。これは勝手にバインディングされるよ。
			//気にくわないときは文字列をreturnするといいよ。errorイベントが発火されるよ
			if(!!attr && attr.alpha < 0){
				return "おい！透明度がマイナスってお前！";
			}
		},
		//-----------
		//自分でイベントバインディングをしてあげないとダメなメソッドさんたち
		changeFunc : function(model){
			//値の更新処理を書く？
			console.log(model);
		},
		errorFunc : function(model, errMsg){
			console.log(errMsg);
		},
		//-----------
		url : './jquery.kfAnimation.1.1.js', // model.fetch()メソッドを実行すると、このURLにアクセスするよ。XMLHttpRequestでだよ。ドメイン境界の問題はあるよ
		parse: function(data) { // model.fetch()メソッドを実行した結果が、帰ってきます。
			console.log(data);
		}
	});
	
	
	
	//----------------------------------------------------------------------------------
	// *****  C o l l e c t i o n  *****
	
	App.Collections.PropCollection = Backbone.Collection.extend({
		//model : App.Models.PropModel, //なくてもOKらしい【追記】これちがくねぇ！？ mode: new App.Models~~~ なので、インスタンス化しなきゃダメ????
		initialize : function(){
			this.on("add",    this.addFunc); //コレクション追加時のイベント
			this.on("remove", this.removeFunc); //コレクション削除時のイベント
		},
		//---------
		//自分でイベントバインディングをしてあげないとダメなメソッドさんたち
		addFunc: function(model){
			console.log(model)
		},
		removeFunc: function(model){
			console.log(model)
		}
		
	});
	
	
	
	//----------------------------------------------------------------------------------
	// *****  V i e w  *****
	
	//Viewメモ：
	/*
	// 以下は'UL.team-element'を生成する
	App.Views.Teams = Backbone.View.extend({
		el : 'UL.team-list'
	});
	// 以下は 'div.team-element'を生成する
	App.Views.Team = Backbone.View.extend({
		className : '.team-element',
		tagName : 'div'
	});
	*/
	
	App.Views.PropView = Backbone.View.extend({
		tagName : "div", //省略可能？ラップするタグ
		el : $('#prop_detail'),
		//template : _.template($("#prop-template").html()),
		model : new App.Models.PropModel, //【追記】今回のように、viewとmodelを入れ替えるならここに有るべきじゃないと思う
		
		initialize : function(){
			this.model.on("change", this.render, this);//modelが変更された時に、renderイベントを走らせる。第3引数"this"を与えることで、this.render内でのthis参照が可能
			
			//以下は、Backbone.js 0.5.2 以前のバージョン用。上記と同じ事をしている。
			//_.bindAll(this, "render");
			//this.model.bind("change", this.render);
			
		},
		setModel: function(model){
			this.model.off("change", this.render, this);//古いModelから削除
			
			this.model = model;
			this.model.on("change", this.render, this);
		},
		render : function(){
			alert("レンダー！！");
			
			var data = this.model.toJSON();//モデル取得
			console.log(data)
			//var html = this.template(data[0]);//テンプレート適用
			//console.log($(this.el)	)
			//$(this.el).html(html); // 上書き
			
			//// Compile the template
			//var compiledTemplate = _.template($('#teamTemplate').html());
			//// Model attributes loaded into the template. Template is
			//// appended to the DOM element referred by the el attribute
			//$(this.el).html(compiledTemplate(this.model.toJSON()));
			
		},
		events : { //イベントハンドラのマッピング
			"click a.more" : "moreInfo"
		},
		moreInfo : function(e){
			 // Logic here
		}
	});
	
	window.Apps = new App.Views.PropView({ model: new App.Collections.PropCollection() });
	
	
	
	//---------------------------------------------------------------------------------
	//Routerを定義します
	App.Routers.Main = Backbone.Router.extend({
		
	   // Hash maps for routes
	   routes : {
			"" : "index",
			"teams" : "getTeams",
			"teams/:objectName" : "getObject",
			"teams/:objectName/:frame" : "getFrame",
			"*error" : "fourOfour"
	   },
	   
	   index: function(){
		   // Homepage 
	   },
	   
	   getTeams: function() {
		   // List all teams 
		   console.log('getTm');
	   },
	   getObject: function(objectName) {
		   // Get list of teams for specific objectName
		   console.log(objectName);
	   },
	   getFrame: function(objectName, frame) {
		   // Get the teams for a specific country and with a specific frame
		   console.log(objectName, frame);
	   },	
	   fourOfour: function(error) {
		   // 404 page
		   console.log(error)
	   }
	});
	
	
	//---------------------------------------------------------------------------------
	
	//Router機能を使います
	var router = new App.Routers.Main();
	window.router = router;
	
	//hashchangeイベントを監視します（html5のpushStateイベントも監視します）
	//Backbone.history.start({pushState: true, root: "/public/search/"}); //もしかしなくても、pushStateで、hashBang-URLじゃないならサーバ側の対応も必要なんやな
	Backbone.history.start();
})


$(function(){
				//テーブル構築
				 $('timeline_table').show()
				var tbl = $('#timeline_table').empty();
				tbl.append('<thead>').append('<tbody>');
				
				var test = {
					obj1 : {
						 0 : {opacity : 1},
						10 : {opacity : 0}
					},
					obj2 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj3 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj4 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj5 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj6 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj7 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj8 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					},
					obj9 : {
						10 : {opacity : 1},
						20 : {opacity : 0}
					}
				}
				//初期化
				var thead = $('<tr>').appendTo(tbl.find('thead')).append('<th>オブジェクト名＼フレーム数</th>');
				var tbodys = {};
				for(var key in test){
					tbodys[key] = $('<tr>').appendTo(tbl.find('tbody')).append('<td>' + key + '</td>')
				}
				//create table
				for(var i=0; i< 120; i++){
					if(i %5 == 0) thead.append('<th colspan="5">' + i + '</th>')
					for(var key in test){
						var obj = test[key][i];
						if(obj){
							tbodys[key].append('<td>　' + '</td>')
						}else{
							tbodys[key].append('<td>　</td>')
						}
					}
				}
				
				
				//タイムライン表示化
				$('#timeline').empty();
				tbl.clone().show().appendTo('#timeline').fixedTable({
		            width: 960,
		            height: 135,
		            fixedColumns: 1,
		            classHeader: "fixedHead",// header style
		            classFooter: "fixedFoot",// footer style
		            classColumn: "fixedColumn",// fixed column on the left  
		            fixedColumnWidth: 160,// the width of fixed column on the left   
		            outerId: 'timeline',// table's parent div's id 
		            Contentbackcolor: "#FFFFFF",// tds' in content area default background color  
		            Contenthovercolor: "#99CCFF", // tds' in content area background color while hover. 
		            fixedColumnbackcolor:"#187BAF", // tds' in fixed column default background color  
		            fixedColumnhovercolor:"#99CCFF" // tds' in fixed column background color while hover.  
		        });
		        $('.fixedContainer table').css('table-layout','fixed')

})