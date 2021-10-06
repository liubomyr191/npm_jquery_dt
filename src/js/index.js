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
        "order":[[0,'desc']]
        //,"dom":"<'dtToolBar'<'dtInfo'li>p<'dtFilters'>Bf><>t"
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
          ,"url":"http://3.139.87.28/backend/DataTables/"
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
        ,"initComplete": function(settings, json) {
          /*let exportMenu=$(this).parents("#dbDt_wrapper");
          exportMenu.find(".dt-buttons").addClass("dropdown-menu");
          exportMenu.find(".dtExports").prepend("<div class='dropdown-toggle' data-bs-toggle='dropdown'><span>Export</span><i class='fas fa-download'></i></div>");
          exportMenu.find(".dt-button").addClass("dropdown-item");
          exportMenu.find(".dtFilters").append("<span>Filters</span><i class='fas fa-filter'></i>");
          exportMenu.find(".dtAdd").append("<span>Add</span><i class='fas fa-plus-circle'></i>");*/
        }
      };
  }
}

function filterableTable(htmlTable,url){
	if(htmlTable.length==0){return;}
  let availableFields=[];
	let tableId=$(htmlTable)[0].id;
	let conf=componentsFormats.dtTable();

  //add index and data-name to columns for later use
	htmlTable.find("thead>tr>th").each((index,header)=>{
		$(header).attr("data-num",index);
    $(header).attr("data-name",$(header).text()!="" ? $(header).text().replace(" ","_") : "-1");
		if($(header).attr("data-name")==-1){return;}
		availableFields.push({"name":$(header).attr("data-name"),"type":$(header).attr("data-type"),"text":$(header).text()});
	});
	
	//create modal to filter table data
/*	$("body").append(
		`<div class='modal fade modalFilter' role='dialog' id='modalFilter${tableId}'>
			<div class='modal-dialog'  role='document'>
				<div class='modal-content'>
					<div class='modal-header'>
						<h5>Configuracion</h5>
						<button data-bs-toggle='modal' data-bs-target='#modalFilter${tableId}'><i class='fa fa-times'></i></button>
					</div>
					<div class='modal-body'>
						<fieldset>
							<legend>Filtros</legend>
							<ul data-name='filterCotainer'></ul>
							<button class='btn btn-light' data-name='addFilter'>
								<i class='fa fa-plus-circle'></i>Agregar filtro
							</button>
						</fieldset>
					</div>
					<div class='modal-footer'>
						<button class='btn btn-success' id='applyFilters'>Aplicar</button>
					</div>
				</div>
			</div>
		</div>`
	);
	$(`#modalFilter${tableId}`).find("[data-name='addFilter']").click(()=>{filterableTableFilters(`modalFilter${tableId}`,'addField',availableFields)});
	
	conf.ajax.url=url;
	conf.ajax.data=function(d){
		d.opt="dbData";
		d.filters=filterableTableFilters(`modalFilter${tableId}`,"getFilters");
	};
	return {
		conf
		,initTable:(args)=>{
			let dataTable=$(htmlTable).DataTable(args);
			dataTable.on("preDraw",function(){ $(this).find("dropdown-item").off(); });
			$(`#modalFilter${tableId}`).find("#applyFilters").click(()=>{ $(`#modalFilter${tableId}`).modal("hide"); dataTable.ajax.reload(); });
			$(htmlTable).parentDOM(1).addClass("dataTableContainer");
			$(`#modalFilter${tableId}`).find("[data-name='exportContainer']").append($(htmlTable).parentDOM(2).find(".dtExport"));
			$(htmlTable).parentDOM(1).find(".dtCustomFilter").attr({"data-bs-toggle":"modal","data-bs-target":`#modalFilter${tableId}`}).html("<img  src='/CepudoV2/src/img/Icon/settings-48dp.png'><p>Configuracion</p>");
			$(htmlTable).parentDOM(2).find(".dt-buttons").remove();
			return dataTable;
		}
	}*/
}

window.componentsFormats=componentsFormats;
window.filterableTable=filterableTable;



const router = new Navigo("/");
router
.on("/",()=>{
  $("#app").load("/src/pages/menu.html");
})
.resolve();