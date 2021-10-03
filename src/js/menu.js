let componentsFormats={
  dtTable:()=>{
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
        ,"language":{
          "lengthMenu":"_MENU_"
          ,"paginate":{"first":"<i class='fas fa-angle-double-left'></i>","previous":"<i class='fas fa-angle-left'></i>","next":"<i class='fas fa-angle-right'></i>","last":"<i class='fas fa-angle-double-right'></i>"}
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
                $(win.document.body).find("table").removeClass("dt-tabla espacio-1");
                $(win.document.body).find("table").css("cssText","margin-top:0px !important;margin-bottom:0px !important;");
                $(win.document.body).find("table").css({"font-size":"inherit","width":"100%"}).addClass("table table-stripped compact");
            }
          }
        ]
      };
    }
  }

//console.log($("#dbDt"));
$("#dbDt").DataTable(componentsFormats.dtTable());