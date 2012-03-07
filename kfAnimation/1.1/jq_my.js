	$(function() {
		window.currentObject = $("#box1")
		window.functionChain = [];
		window.callChain = function(obj){
			for(var i=0; i<functionChain.length; i++){
				functionChain[i].apply(obj, _.rest(arguments));
			}
		}
		
		
		// tab view ----------------
		var $tab_title_input = $( "#tab_title")
		var tab_counter = 5;
		var tab_content_wrapper = '';

		// tabs init with a custom tab template and an "add" callback filling in the content
		var $tabs = $( "#tabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				$( ui.panel ).append( '<textarea class="code_area">' + tab_content_wrapper + '</textarea>' );
			},
			select: function(event, ui) {
				console.log(ui.panel)
			}
		});
		
		// modal dialog init: custom buttons and a "close" callback reseting the form inside
		var $dialog = $( "#tab_dialog" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Add: function() {
					addTab($tab_title_input.val());
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			open: function() {
				$tab_title_input.focus();
			},
			close: function() {
				$form[ 0 ].reset();
			}
		});

		// addTab form: calls addTab function on submit and closes the dialog
		var $form = $( "form", $dialog ).submit(function(){
			addTab($tab_title_input.val());
			$dialog.dialog( "close" );
			return false;
		});

		// actual addTab function: adds new tab using the title input from the form above
		function addTab(title, content) {
			tab_counter++;
			var tab_title = title || "t_"+ tab_counter;
			tab_content_wrapper = content || '// input your code ';
			$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title );
		}
		
		function getTabsData(){
			var labels = $tabs.children().first().children().find('a');
			var contents = $tabs.children('div').children('textarea')
			var arr  = [];
			for(var i=0; i<labels.length; i++){
				arr[i] = {};
				arr[i].title = labels.eq(i).text();
				arr[i].content = contents.eq(i).val();
			}
			return arr;
		}
		
		function reset_box(){
			  $('.demo_box').css({
				position: 'absolute',
					top:'100px', left:'15px',
					width:'150px', height:'150px',
					'-webkit-border-radius':'5px',
					'-moz-border-radius':'5px',
					background:'#522F7F',
					color:'#fff',
					'font-weight':'bold',
					'line-height':'60px',
					'text-align':'center',
					cursor: 'default',
					opacity: 1
				});
				$('#box2').css({'left': '460px', background:'#965849'});
			}
		reset_box();

		//--------------------------------
		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		$( "#tabs span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $tabs ).index( $( this ).parent() );
			$tabs.tabs( "remove", index );
		});
		
		// addTab button: just opens the dialog
		$( "#add_tab" )
			.button()
			.click(function() {
				$dialog.dialog( "open" );
			});
		$( "#reset" )
			.button()
			.click(function() {
				reset_box();
			});
		//execute button
		$( "#execute")
			.button()
			.click(function(){
				var selectedId = $tabs.tabs('option', 'selected') ;
				var targetId = $("#tabs_list").children().eq(selectedId).find("a").attr("href");
				try {
					eval($(targetId).find('textarea').val());
				} catch(e) {
					alert('It was a problem with your code!');
				}
			});
		//save button
		$('#save')
			.button()
			.click(function(){
				var savedata = { idx : $tabs.tabs('option', 'selected') };
				savedata.tabs = getTabsData();
				localStorage['savedata'] = JSON.stringify(savedata);
			});
		//clearData button
		$('#clearData')
			.button()
			.click(function(){
					$( "#dialog:ui-dialog" ).dialog( "destroy" );
					$( "#dialog-message" ).dialog( "open" );
			});	
		$('#clear_img')
			.button()
			.click(function(){
					currentObject.css('backgroundImage', 'none')
			});	
		$('#relaod_tl')
			.button()
			.click(function(){
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
		//------------------------------------
		
		//textarea configiration
		$(document).on('keydown', 'textarea', function(e){
			var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
			if(kC == 9){ // 9 tab
				if (this.setSelectionRange){
					var o = this;
					var sS = o.selectionStart;
					var sE = o.selectionEnd;
					o.value = o.value.substring(0, sS) + "\t" + o.value.substr(sE);
					o.setSelectionRange(sS + 1, sS + 1);
					o.focus();
					return false;
				}
			}
		})
		
		
		//load function 
		var savedata = localStorage['savedata'];
		if(savedata){
			//clear
			while($tabs.children().length > 1){
				$tabs.tabs( "remove", 0 );
			}
			
			//load
			savedata = JSON.parse(savedata);
			var tabData = savedata.tabs;
			for(var i=0; i<tabData.length; i++){
				addTab(tabData[i].title,  tabData[i].content);
			}
			$tabs.tabs( "option", "selected", savedata.idx);
		}
		$( "#dialog-message" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Ok: function(){
					delete localStorage['savedata'];
					location.href = location.href;
					$( this ).dialog( "close" );
				},
				cancel:function(){
					$( this ).dialog( "close" );
				}
			}
		});

	//----------
	// prop area
		var setSlider = function(sourceId, option){
			var input = $("#" + sourceId);
			var option = option || {};
			option.max = option.max || input.attr("max") || 100; //max:0 のときに100になっちゃうが、そんなパターンないだろー
			option.min = option.min || input.attr("min") || 0;
			option.val = option.val || input.val()       || 0;
			option.step = option.step || input.attr("step") || 1;
			
			if(!input.val()){
				input.val(option.val)
			}
			
			var slider = $( "<div class='prop_slider'></div>" ).insertAfter( input ).slider({
				min: +option.min,
				max: +option.max,
				range: "min",
				step : +option.step,
				//value: input[ 0 ].selectedIndex + 1,
				value : +option.val,
				slide: function( event, ui ) {
					//input[ 0 ].selectedIndex = ui.value - 1;
					input.val(ui.value)
					callChain(this, sourceId, ui.value);
				}
			});
			input.on('input', function() {
				slider.slider( "value", $(this).val() );
				callChain(this, sourceId, $(this).val());
			});
			input.attr("max", option.max)
			input.attr("min", option.min);
			$("<span> (" + option.min + " - " + option.max + ") </span>" ).insertAfter( input )
		}
		setSlider("opacity", {step: 0.01});
		setSlider("top");
		setSlider("left");
		setSlider("width");
		setSlider("height");
		setSlider("transform_rotate");
		setSlider("transform_scaleX", {step: 0.1});
		setSlider("transform_scaleY", {step: 0.1});
		setSlider("border-radius");
		functionChain.push(function(name, value){
			currentObject.css(name, value)
		})
		
		// image setting
		$("#image_url").on('input', function(){
			currentObject.css('backgroundImage', 'url(' + $(this).val() +')')
		})
		// color setting
		var colorInput = $('#colorSelector');
		colorInput.ColorPicker({
			color: colorInput.val() || '#0000ff',
			onChange: function (hsb, hex, rgb) {
				$("#colorSelector").val('#' + hex);
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
		
	});