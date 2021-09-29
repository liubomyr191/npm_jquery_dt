import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/index.css";
import $ from "jquery";
import "bootstrap";
window.jQuery = window.$ = $;
import JSZip from "jszip";
window.JSZip = JSZip;
import "pdfmake";
import DataTable from "datatables.net";
DataTable(window, $);
import buttons from "datatables.net-buttons";
buttons(window,$);
import responsive from "datatables.net-responsive";
responsive(window,$);
import buttonsHtml5 from "datatables.net-buttons/js/buttons.html5.js";
buttonsHtml5(window, $);
import buttonsPrint from "datatables.net-buttons/js/buttons.print.js";
buttonsPrint(window, $);

/*import Navigo from "navigo";
const router = new Navigo("/");
router
.on("/",()=>{
  $("#app").load("/src/pages/menu.html");
})
.resolve();*/


let componentsFormats={
  sajax:(httpUrl="",httpType="POST",httpData={})=>{
    return{
        "url":httpUrl
        ,"method":httpType
        ,"data":httpData
        ,"timeout":30000
        ,"beforeSend":()=>{}
        ,"fail":(data,xhr, status, error)=>{return xhr.responseText;}
        ,"success":()=>{}
    }
  }
  ,dtTable:()=>{
    return {
      "order":[[0,'desc']]
      ,"dom":"<'dtToolBar'<'dtInfo'li>pBf>t"
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
      /*,"ajax":{
        "type":"POST"
        ,"error":(xhr, status, error)=>{ if(xhr.status>=200 && xhr.status<=299){return;} return xhr.status;}
      }*/
      ,"language":{
        "lengthMenu":"_MENU_"
        ,"paginate":{"first":"first","previous":"prev","next":"next","last":"last"}
        ,"infoEmpty":"0 a 0 de 0"
        ,"emptyTable":"Sin registros."
        ,"info":"_START_ a _END_ de _TOTAL_"
        ,"search":"Buscar:"
        ,"infoFiltered":"Filtrando _MAX_ registros"
        ,"loadingRecords":"Recuperando registros..."
        ,"aria":{"sortAscending":": Ordernar ascendente","sortDescending": ": Ordenar descendente"}
      }
      ,"columnDefs":[
        {"targets":0,"class":"dtDetails"}
        ,{"targets":-1,"width":"1px","orderable":false,"searchable":false,"data":null,"class":"dtRowsActions","render":()=>{
          return `<div class='dropstart'>
                <div class='dropdown-toggle' data-bs-toggle='dropdown'>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div class='dropdown-menu'>
                  <a class='dropdown-item' data-cmd='Eliminar'><i class='far fa-trash-alt'></i>Eliminar</a>
                  <a class='dropdown-item' data-cmd='Modificar'><i class='fas fa-edit'></i>Modificar</a>
                </div>
              </div>`;
        }}
      ]
      ,"buttons":[
        {"extend":"excelHtml5","className":"dtExport","text":"<i class='fas fa-file-excel'></i>","exportOptions":{"columns":"th[data-export='y']"}}
        ,{"extend":"pdfHtml5","className":"dtExport","text":"<i class='fas fa-file-pdf'></i>","exportOptions":{"columns":"th[data-export='y']"}}
        ,{"extend":"print","className":"dtExport","text":"<i class='fas fa-print'></i>","exportOptions":{"columns":"th[data-export='y']"}
          ,"customize":(win)=>{
            $(win.document.body).css("font-size","0.95rem");
            $(win.document.body).find("h1").remove();
            $(win.document.body).find("div").remove();
            $(win.document.body).find("table").removeClass("dt-tabla espacio-1");
            $(win.document.body).find("table").css("cssText","margin-top:0px !important;margin-bottom:0px !important;");
            $(win.document.body).find("table").css({"font-size":"inherit","width":"100%"}).addClass("table table-stripped compact");
          }
        }
      ]
    };
  }
}

$('#dbDt').DataTable(componentsFormats.dtTable());