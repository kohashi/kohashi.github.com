
// backbone.jsを使うよ！

$(function(){
	//【TODO】window定義はあとでやめる
	window.App ={Models:{}, Collections:{}, Views:{}, Routers:{} , Instances:{}, Data:{}};//名前空間的な
	
	
	App.Data.timeline = {
					obj1 : {
						 0 : {width:'100px', height:'100px', backgroundColor:"#522F7F", left:'10px', top:'10px'},
						10 : {opacity : 0}
					},
					obj2 : {
						10 : {width:'100px', height:'100px', backgroundColor:"#522F7F", left:'10px', top:'10px'},
						20 : {opacity : 0}
					}
				};
	
	
	//----------------------------------------------------------------------------------
	// *****  M o d e l  *****
	App.Models.PropModel = Backbone.Model.extend({
		//■オーバーライド関数 Overrides
		initialize: function () {
			//初期化時にModelのイベントバインディングを行う。生成後でもいいんだけどね。自動ではやってくれないよ
			this.on('change', this.changeFunc)
			this.on('error',  this.errorFunc);
		},
		defaults :{ //Modelのデフォルト値を設定します
			frame : 0,
			color : '#ffffff'
		},
		destroy : {//破棄時のイベント。勝手にバインディングをされるよ。
			
		},
		validate : function(attr){//validateメソッドを作ると、値の入力を拒否できるよ。これは勝手にバインディングされるよ。
			//気にくわないときは文字列をreturnするといいよ。errorイベントが発火されるよ
			if(!!attr && attr.opacity < 0){
				return "おい！透明度がマイナスってお前！";
			}
		},
		//■自分で定義した関数 Custom function -----------
		changeFunc : function(model){
			//値の更新処理を書く？
			//console.log(model);
		},
		errorFunc : function(model, errMsg){
			//console.log(errMsg);
		},
		//-----------
		url : './jquery.kfAnimation.1.1.js', // model.fetch()メソッドを実行すると、このURLにアクセスするよ。XMLHttpRequestでだよ。ドメイン境界の問題はあるよ
		parse: function(data) { // model.fetch()メソッドを実行した結果が、帰ってきます。
			console.log(data);
		}
	});
	
	

	App.Models.TimelineModel = Backbone.Model.extend({
		//■オーバーライド関数 Overrides
		initialize: function (timeline) {
			for(var k in timeline){
				timeline[k];
				for(var t in timeline[k]){
					console.log(k + ' : ' + t * ' : ' + timeline[k][t]);//本当はテーブルの色を変える処理、か？
				}
			}
		},
		//■自分で定義した関数 Custom function -----------
		addFunc: function(model){
			console.log(model)
		},
		removeFunc: function(model){
			console.log(model)
		}
	});
	
	
	//----------------------------------------------------------------------------------
	// *****  C o l l e c t i o n  *****
	
	
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
		//■オーバーライド関数 Overrides
		el : $('#prop_detail'),
		//model : new App.Models.PropModel, //【追記】今回のように、viewとmodelを入れ替えるならここに有るべきじゃないと思う
		initialize : function(model){
			model && this.setModel(model);
			
		},
		/** Viewに関連付けられているModelを変更する */
		setModel: function(model){
			this.model && this.model.off("change", this.render, this);//古いModelから削除
			console.log(model)
			this.model = model;//新しいModel適用
			this.model.on("change", this.render, this);//modelが変更された時に、renderイベントを走らせる。第3引数"this"を与えることで、this.render内でのthis参照が可能
			this.loadFrom(this.model);
		},
		/** 描画 */
		render : function(){
			console.log("プロップレンダー！！");
			
			var data = this.model.toJSON();//モデル取得
			//console.log(JSON.stringify(data))
			//var html = this.template(data[0]);//テンプレート適用
			//console.log($(this.el)	)
			//$(this.el).html(html); // 上書き
			
			//// Compile the template
			//var compiledTemplate = _.template($('#teamTemplate').html());
			//// Model attributes loaded into the template. Template is
			//// appended to the DOM element referred by the el attribute
			//$(this.el).html(compiledTemplate(this.model.toJSON()));
			
		},
		//■自分で定義した関数 Custom function -----------
		loadFrom :function(model){
			//text系
			$('#kf_object_name').val(this.model.get(('kf_object_name')))
			$('#color').val(this.model.get(('color')))
			
			//slider系
			var __setSlider = _.bind(setSlider, this);
			__setSlider("opacity", {step: 0.01});
			__setSlider("top", {unit: 'px'});
			__setSlider("left", {unit: 'px'});
			__setSlider("width", {unit: 'px'});
			__setSlider("height", {unit: 'px'});
			__setSlider("transform_rotate", {unit: 'px'});
			__setSlider("border_radius", {unit: 'px'});
		},
		sliderInputs : {} //setSliderの中から呼ばれる
	});
	
	
	App.Views.TimelineView = Backbone.View.extend({
		//■オーバーライド関数 Overrides
		initialize : function(){
			this.model.on("change", this.render, this);
			
			
		},
		model : new App.Models.TimelineModel(App.Data.timeline),
		//■自分で定義した関数 Custom function -----------
		render : function(){
			console.log('タイムラインレンダー')
			//テーブル構築
			var data = this.model.toJSON();
			
			buildTimelineTable(data);
		},
	});
	
	
	
	
	//----------------------------------------------------------------------------------
	// *****  I n s t a n c e  *****
	//インスタンス化
	var model = new App.Models.PropModel({"frame":0,"name":"object_c1","opacity":"0.92","top":"47px","left":"76px","width":"122px","height":"157px","transform_rotate":"0px","transform_scaleX":"1","transform_scaleY":"1","border_radius":"1px"})
	
	App.Instances.PropView     = new App.Views.PropView(model);
	App.Instances.TimelineView = new App.Views.TimelineView();
	
	
	//----------
	// prop area

		
		// image setting
		$("#image_url").on('input', function(){
			currentObject.css('backgroundImage', 'url(' + $(this).val() +')')
		})
		// color setting
		var colorInput = $('#color');
		colorInput.ColorPicker({
			color: colorInput.val() || '#0000ff',
			onChange: function (hsb, hex, rgb){
				$("#color").val('#' + hex);
				currentObject.css('backgroundColor', '#' + hex);
			},
			onShow : function(colpkr){
				$(colpkr).css('z-index',9999)
			}
		});
		// other css setting
		$("#other_css").on('input', function(){
			try{
				var obj = JSON.parse($(this).val())
				currentObject.css(obj);
			}catch(e){
			}
		});
		$( "#dialog" ).dialog({autoOpen:false, position:'right'});
		$("#dialog_button").on("click", function(){$( "#dialog" ).dialog("open")});
	
	
	//---------------------------------------------------------------------------------
	// Render系の処理
	
	
	//----------------------------------------------------------------------------------
	// *****  巻き上げ関数定義(後で詳細は定義するが面倒なので_.bindでごまかす奴ら)  *****
	
	function setSlider(sourceId, option){
			var input = $("#" + sourceId);
			var option = option || {};
			option.max = option.max || input.attr("max") || 100; //max:0 のときに100になっちゃうが、そんなパターンないだろー
			option.min = option.min || input.attr("min") || 0;
			option.val = option.val || this.model.get(sourceId) || input.val() || 0;
			option.step = option.step || input.attr("step") || 1;
			option.unit = option.unit || '';
			
			option.val = (option.val + '').replace(option.unit, '')
			
			if(!input.val()){
				input.val(option.val)
			}
			
			if(this.sliderInputs[sourceId]){
				this.sliderInputs[sourceId].val(option.val).trigger('input');
				return;
			}
		
			
			var updaetView = _.bind(function(name, value){
				if(currentObject){
					//console.log(name + ' x:x '+ value + ' : ' + currentObject.css(name))
					currentObject.css(name.replace('_','-'), value )
					this.model.set(name, value);//modelへの変更
					window.currentStyle[name] = value;
				}
			},this);
			
			//スライダ生成
			var slider = $( "<div class='prop_slider'></div>" ).insertAfter( input ).slider({
				min: +option.min,
				max: +option.max,
				range: "min",
				step : +option.step,
				value : +option.val,
				slide: function( event, ui ) {
					input.val(ui.value)
					updaetView(sourceId, ui.value+ option.unit);
					
				}
			});
			input.on('input', function() {
				slider.slider( "value", $(this).val() );
				updaetView(sourceId, $(this).val()+ option.unit);
			});
			input.attr("max", option.max);
			input.attr("min", option.min);
			$('<span> (' + option.min + ' - ' + option.max + ') </span> <label><input type="checkbox" />アニメ化</label>' ).insertAfter( input )
			this.sliderInputs[sourceId] = input;
			input.val(option.val.replace(option.unit, '')).trigger('input');
			
			
		}
	function buildTimelineTable(data){
		var tbl = $('#timeline_table').show().empty().append('<thead>').append('<tbody>');
		
		//初期化
		var thead = $('<tr>').appendTo(tbl.find('thead')).append('<th>オブジェクト名＼フレーム数</th>');
		var tbodys = {};
		for(var key in data){
			tbodys[key] = $('<tr>').appendTo(tbl.find('tbody')).append('<td>' + key + '</td>')
		}
		//create table
		for(var i=0; i< 120; i++){
			if(i %5 == 0) thead.append('<th colspan="5">' + i + '</th>')
			for(var key in data){
				var obj = data[key][i];
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
			Contentbackcolor: "white",// tds' in content area default background color  
			fixedColumnbackcolor:"#187BAF", // tds' in fixed column default background color  
		});
		$('.fixedContainer table').css('table-layout','fixed');
		
		
		//タイムラインクリックイベント ---------------------------------------------
		$('#timeline_table td').on('click',function(){
			var tr = $(this).parent();
			var trIdx = tr.parent().children().index(tr);
			var objId = $(".fixedColumn .fixedTable tr").eq(trIdx).text();
			var frame = tr.children().index(this);
			var anims = data[objId];
			
			console.log(objId + ' : ' + frame);
			
			window.currentStyle = anims[frame] || {};
			
			//オブジェクト色つけ
			var hasProp = anims[frame];
			$(this).css('backgroundColor', hasProp?'white':'red').attr('hasprop', !hasProp?'true':'');
			
			//currentObj変更（操作対象変更）
			window.currentObject = $("#" + objId);
			
			//データ合成
			
			console.log(111)
			
			window.compositStyle = {};
			_.each(_.keys(anims), function(keyFrame){
				if(keyFrame <= +frame){
					for(var k in anims[keyFrame]){
						window.compositStyle[k] = anims[keyFrame][k] || window.compositStyle[k];
					}
					console.log(anims[keyFrame])
				}else return false;
			});
			console.log(222)
			
			
			//PropViewのmodel変更（値適用）, render呼び出し
			App.Instances.PropView.setModel(new App.Models.PropModel(window.compositStyle));
		})
	
	}
	//---------------------------------------------------------------------------------
})
