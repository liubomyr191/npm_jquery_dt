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
        ,"dom":"<'dtToolBar'<'dtInfo'li>p<'dtFilters'>Bf><>t"
        ,"pagingType":"full_numbers"
        ,"deferRender":true
        ,"processing":true
        ,"serverSide":false
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
          {"extend":"excelHtml5","title":"","className":"dtExport","text":"<i class='fas fa-file-excel'></i>","exportOptions":{"columns":"th[data-export='y']"}}
          ,{"extend":"pdfHtml5","title":"","className":"dtExport","text":"<i class='fas fa-file-pdf'></i>","exportOptions":{"columns":"th[data-export='y']"}}
          ,{"extend":"print","title":"","className":"dtExport","text":"<i class='fas fa-print'></i>","exportOptions":{"columns":"th[data-export='y']"}
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
}

window.componentsFormats=componentsFormats;


const router = new Navigo("/");
router
.on("/",()=>{
  $("#app").load("/src/pages/menu.html");
})
.resolve();