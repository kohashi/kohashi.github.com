$(function(){
			var PropModel = Backbone.Model.extend({
			    initialize: function () {
			        this.set({
			            domId: 'tweet_' + this.cid
			        })
			    },

				defaults :{
					alpha : 1,
					display : true,
					frame : 0
				},
				destroy : {
					
				},
				validate: function(){
					
				}
			});
            var PropCollection = Backbone.Collection.extend({
            	model : PropModel, //なくてもOKらしい
            	initialize : function(){
            		//this.bind("add", function(obj){}, this) //コレクション追加時のイベント
            	}
            });
            var PropView = Backbone.View.extend({
            	tagName : "div", //省略可能？ラップするタグ
            	el : $('#prop_detail'),
            	//template : _.template($("#prop-template").html()),
            	events: { //イベントハンドラのマッピングらしい
            		//"click input" : "_onChange"
            	},
            	initialize : function(){
            		this.model.bind("change", this.render, this);
            	},
            	add_me : function(){
            		var name = "aaaa"//$("#hoge").val()
            		var prop = new PropModel({alpha:0.3})
            		this.model.add(prop);
            	},
            	render : function(){
            		var data = this.model.toJSON();//モデル取得
            		//var html = this.template(data[0]);//テンプレート適用
            		//console.log($(this.el)	)
            		//$(this.el).html(html); // 上書き
            		
            		
            	}
            });
            window.App = new PropView({ model: new PropCollection() });
          });
          




