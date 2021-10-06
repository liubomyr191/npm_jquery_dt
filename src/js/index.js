import "@fortawesome/fontawesome-free/css/all.min.css";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/index.css";

import $ from "jquery";
window.jquery = window.$ = $;
import "bootstrap";
import JSZip from "jszip"; window.JSZip = JSZip;
import "pdfmake";
import dt from "datatables.net"; dt(window, $);
import dtResp from "datatables.net-responsive"; dtResp(window, $);
import dtBtnHtml5 from "datatables.net-buttons/js/buttons.html5.js"; dtBtnHtml5(window, $);
import dtBtnPrint from "datatables.net-buttons/js/buttons.print.js"; dtBtnPrint(window, $);
import Navigo from "navigo";

var componentsFormats={
  dtTable:()=>{
      return {
        "order":[[0,"desc"]]
        ,"dom":"<'dtToolBar'<'dtInfo'li>f<'dtAdd'><'dtFilters'><'dtExports dropdown'B>><t>p"
        ,"pagingType":"full_numbers"
        ,"deferRender":true
        ,"processing":true
        ,"serverSide":true
        ,"responsive":{
          "details":{
            "renderer":(api, rowIdx, columns)=>{
              let temp;
              columns.forEach(col=>{
                if(!col.hidden){return;}
                temp+=`<tr data-dt-row='${col.rowIndex}' data-dt-column='${col.columnIndex}'><td>${col.title}:</td><td>${col.data}</td></tr>`;
              });
              return temp?$("<div />").append($("<table class='dtRowDetails' />").append(temp)):false;
            }
          }
        }
        ,"ajax":{
          "type":"POST"
          ,"datatype": "json"
          ,"error":(xhr, status, error)=>{if(xhr.status>=200 && xhr.status<=299){return;} console.log(`HTTP request error: ${xhr.status}`); }
        }
        ,"language":{
          "lengthMenu":"_MENU_"
          ,"paginate":{"first":"<i class='fas fa-angle-double-left'></i>","previous":"<i class='fas fa-angle-left'></i>","next":"<i class='fas fa-angle-right'></i>","last":"<i class='fas fa-angle-double-right'></i>"}
          ,"infoEmpty":"Empty."
          ,"emptyTable":"No data."
          ,"info":"_START_ - _END_ of _TOTAL_"
          ,"search":"Search:"
          ,"infoFiltered":"(From _MAX_ records)"
          ,"loadingRecords":"Loading..."
          ,"aria":{"sortAscending":": Order asc.","sortDescending": ": Order desc."}
        }
        ,"columnDefs":[
          {"targets":0,"class":"dtDetails"}
          ,{"targets":-1,"width":"1px","orderable":false,"searchable":false,"data":null,"class":"dtRowsActions","render":()=>{
            return `<div class='dropstart'>
                      <div class='dropdown-toggle' data-bs-toggle='dropdown'>
                          <i class='fas fa-ellipsis-v'></i>
                      </div>
                      <div class='dropdown-menu'>
                        <a class='dropdown-item' data-cmd='Eliminar'><i class='far fa-trash-alt'></i>Eliminar</a>
                        <a class='dropdown-item' data-cmd='Modificar'><i class='fas fa-edit'></i>Modificar</a>
                      </div>
                    </div>`;
          }}
        ]
        ,"buttons":[
          ,{"extend":"excelHtml5","title":"","className":"dtExport","text":"<i class='fas fa-file-excel'></i><span>Excel</span>","exportOptions":{"columns":"th[data-export='y']"}}
          ,{"extend":"pdfHtml5","title":"","className":"dtExport","text":"<i class='fas fa-file-pdf'></i><span>PDF</span>","exportOptions":{"columns":"th[data-export='y']"}}
          ,{"extend":"print","title":"","className":"dtExport","text":"<i class='fas fa-print'></i><span>Print</span>","exportOptions":{"columns":"th[data-export='y']"}
            ,"customize":(win)=>{
                $(win.document.body).css("font-size","0.95rem");
                $(win.document.body).find("h1").remove();
                $(win.document.body).find("div").remove();
                $(win.document.body).find("table").removeClass("dt espacio-1");
                $(win.document.body).find("table").css("cssText","margin-top:0px !important;margin-bottom:0px !important;");
                $(win.document.body).find("table").css({"font-size":"inherit","width":"100%"}).addClass("table table-stripped compact");
            }
          }
        ]
      };
  }
  ,filterOperations:()=>{
		return [
			{"name":"","operation":""}
			,{"name":"Igual","operation":"="},{"name":"Diferente","operation":"!="}
			,{"name":"Mayor","operation":">"},{"name":"Mayor o igual","operation":">="}
			,{"name":"Menor","operation":"<"},{"name":"Menor o igual","operation":"<="}
			,{"name":"Contiene","operation":"LIKE .%-%."},{"name":"No contiene","operation":"NOT LIKE .%-%."}
			,{"name":"Comienza con","operation":"LIKE .-%."},{"name":"No comienza con","operation":"NOT LIKE .-%."}
			,{"name":"Termina con","operation":"LIKE .%-."},{"name":"No termina con","operation":"NOT LIKE .%-."}
		];
	}
}

function filterableTable(htmlTable,url){
	if(htmlTable.length==0){return;}
  let availableFields=[];
	let tableId=$(htmlTable)[0].id;
	let conf=componentsFormats.dtTable();
  conf.ajax.url=url;
	conf.ajax.data=function(d){ d.opt="dbData"; d.filters=getFilters(`#dtFilter_${tableId}`); };

  //add index and data-name to columns for later use
	htmlTable.find("thead>tr>th").each((index,header)=>{
		$(header).attr("data-num",index);
    //replace the spaces in the name for underscore for backend purpose. 
    $(header).attr("data-name",$(header).text()!="" ? $(header).text().replace(" ","_") : "-1");
		if($(header).attr("data-name")==-1){return;}
		availableFields.push({"name":$(header).attr("data-name"),"type":$(header).attr("data-type"),"text":$(header).text()});
	});
	
	//create modal to filter table data
	$("body").append(
		`<div class='modal fade dtFilter' role='dialog' id='dtFilter_${tableId}'>
			<div class='modal-dialog'  role='document'>
				<div class='modal-content'>
					<div class='modal-header'>
						<h5></h5>
						<button data-bs-toggle='modal' data-bs-target='#dtFilter_${tableId}'><i class='fa fa-times'></i></button>
					</div>
					<div class='modal-body'>
						<fieldset>
							<legend>Filters</legend>
							<ul data-name='filterCotainer'></ul>
							<button class='btn btn-light' data-name='addFilter'>
								<i class='fa fa-plus-circle'></i>Add filter
							</button>
						</fieldset>
					</div>
					<div class='modal-footer'>
						<button class='btn btn-success' data-name='applyFilters'>Apply</button>
					</div>
				</div>
			</div>
		</div>`
	);

  let addField=(modal,fields)=>{
    let dom=`<li>
					<fieldset>
						<legend>Column:</legend>
						<div>
							<select class='form-control' data-name='fieldSelect'>
								<option value='-1' data-type='-1'></option>
								${ fields.map(field=>{ return `<option value='${field.name}' data-type='${field.type}'>${field.text}</option>`;}) }
							</select>
							<button data-name='deleteField'><i class='fa fa-times'></i></button>
						</div>
						<ul data-name='fieldOperations'>
							<li>
								<button data-name='addOperation'><i class='fa fa-plus-circle'></i></button>
								<select class='form-control' data-name='operationSelect'>
								${ componentsFormats.filterOperations().map(opt=>{ return `<option value='${opt.operation}'>${opt.name}</option>`; }) }
								</select>
								<input type='text' class='form-control' placeholder='Valor'></input>
							</li>
						</ul>
					</fieldset>
				</li>`;
		$(modal).find("[data-name='filterCotainer']").append(dom);
		let newFilter=$(modal).find("[data-name='filterCotainer']>li:last-child");
		newFilter.find("[data-name='fieldSelect']").change((event)=>{ changeField(event.currentTarget); });
		newFilter.find("[data-name='deleteField']").click((event)=>{ deleteField(event.currentTarget); });
		newFilter.find("[data-name='addOperation']").click((event)=>{ addOperation(event.currentTarget); });
		newFilter.find("[data-name='operationSelect']").change((event)=>{ changeOperation(event.currentTarget); });
  }

  let deleteField=(htmlButton)=>{
    $(htmlButton).attr("disabled",true);
    let field=$(htmlButton).parents("li");
    field.find("*").off();
    field.remove();
  }

  let changeField=(htmlSelect)=>{
    let datatype=$(htmlSelect).find(":selected").attr("data-type");
    let field=$(htmlSelect).parents("li");
    field.find("[data-name='fieldOperations'] input[type='text']").val("");
  }

  let changeOperation=(htmlSelect)=>{
    if($(htmlSelect).val()!=""){return;}
		$(htmlSelect).parent().find("input[type='text']").val("");
  }

  let addOperation=(htmlButton)=>{
    //change the plus for a cross and adds a new click event
    $(htmlButton).find("i").removeClass("fa-plus-circle").addClass("fa-times-circle").attr("data-name","deleteOperation");
    $(htmlButton).off().click((event)=>{ deleteOperation(event.currentTarget); });
    let field=$(htmlButton).closest("fieldset");
    let dataType=field.find("select[data-name='fieldSelect']").find(":selected").attr("data-type");
    field.find("[data-name='fieldOperations']").append(`
        <li>
          <button data-name='addOperation'><i class='fa fa-plus-circle'></i></button>
          <select class='form-control' data-name='operationSelect'>
          ${ componentsFormats.filterOperations().map(opt=>{ return `<option value='${opt.operation}'>${opt.name}</option>`; }) }
          </select>
          <input type='text' class='form-control' placeholder='Valor'></input>
        </li>
    `);

    let newOperation=field.find("[data-name='fieldOperations']>li:last-child");
		newOperation.find("[data-name='addOperation']").click((event)=>{ addOperation(event.currentTarget); });
		newOperation.find("[data-name='operationSelect']").change((event)=>{  changeOperation(event.currentTarget); });
  }

  let deleteOperation=(htmlButton)=>{
    let operation=$(htmlButton).parent();
		operation.find("*").off();
		operation.remove();
  }

  let getFilters=(modal)=>{
    let filters=[];
    let fields=$(modal).find("[data-name='filterCotainer']");
    if(!fields.find(">li").length>=1){return filters;}
    fields.find(">li").each((index,htmlElement)=>{
      let field=$(htmlElement).find("[data-name='fieldSelect']");
      if(field.find(":selected").attr("data-type")=="-1"){return;}
      let temp={};
      temp.name=field.val();
      temp.type=field.find(":selected").attr("data-type");
      temp.operation=[];
      $(htmlElement).find("[data-name='fieldOperations']>li").each((index,operation)=>{
        temp.operation.push({"condition":$(operation).find(">select[data-name='operationSelect']").val(),"value":$(operation).find(">input[type='text']").val()});
      });
      filters.push(temp);
    });
    return filters;
  }

	$(`#dtFilter_${tableId}`).find("[data-name='addFilter']").click(()=>{addField(`#dtFilter_${tableId}`,availableFields)});

	return {
		conf
		,initTable:()=>{
      //create the DataTable object
			let dataTable=$(htmlTable).DataTable(conf);
      //reference the DataTable's wrapper
      let exportMenu=$(htmlTable).parents(".dataTables_wrapper");
			dataTable.on("preDraw",function(){ $(this).find("dropdown-item").off(); });
			$(`#dtFilter_${tableId}`).find("[data-name='applyFilters']").click(()=>{  $(`#dtFilter_${tableId}`).modal("hide"); dataTable.ajax.reload(); });
      exportMenu.find(".dt-buttons").addClass("dropdown-menu");
      exportMenu.find(".dtExports").prepend("<div class='dropdown-toggle' data-bs-toggle='dropdown'><span>Export</span><i class='fas fa-download'></i></div>");
      exportMenu.find(".dt-button").addClass("dropdown-item");
      exportMenu.find(".dtFilters").append("<span>Filters</span><i class='fas fa-filter'></i>").attr({"data-bs-toggle":"modal","data-bs-target":`#dtFilter_${tableId}`});;
      exportMenu.find(".dtAdd").append("<span>Add</span><i class='fas fa-plus-circle'></i>");
			return dataTable;
		}
	}
}

window.componentsFormats=componentsFormats;
window.filterableTable=filterableTable;



const router = new Navigo("/");
router
.on("/",()=>{
  $("#app").load("/src/pages/menu.html");
})
.resolve();