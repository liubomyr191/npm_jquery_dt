/*function filterableTable(htmlTable,url){
	if(htmlTable.length==0){return;}

	let tableId=$(htmlTable)[0].id;
	let conf=componentsFormats.dtTable();
	let availableFields=[];

	htmlTable.find("thead>tr>th").each((index,theader)=>{
		$(theader).attr("data-num",index);
		if($(theader).attr("data-name")==-1){return;}
		availableFields.push({"name":$(theader).attr("data-name"),"type":$(theader).attr("data-type"),"text":$(theader).text()});
	});
	
	//create modal to filter table data
	$("body").append(
		`<div class='modal fade modalFilter' role='dialog' id='modalFilter${tableId}'>
			<div class='modal-dialog'  role='document'>
				<div class='modal-content'>
					<div class='modal-header'>
						<h5>Configuracion</h5>
						<button data-bs-toggle='modal' data-bs-target='#modalFilter${tableId}'><i class='fa fa-times'></i></button>
					</div>
					<div class='modal-body'>
						<fieldset>
							<legend>Exportar</legend>
							<div data-name='exportContainer'></div>
						</fieldset>
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
	conf.ajax.beforeSend=function(){
		if($(htmlTable).find("tbody>tr.dtLoading").length!=0){return;}
		$(htmlTable).find("tbody").append(`<tr class='dtLoading'${ $(htmlTable).find("tbody>tr").length<=0 ? "style='height:30rem;'" : "" }>
											<td colspan='${$(htmlTable).find("thead th").length}'>
												<div>
													<div class='lds-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
												</div>
											</td>
										</tr>`);
	}
	return {
		conf
		,initTable:(args)=>{
			let dataTable=$(htmlTable).DataTable(args);
			dataTable.on("preDraw",function(){ $(this).find("dropdown-item").off(); });
			$(`#modalFilter${tableId}`).find("#applyFilters").click(()=>{ $(`#modalFilter${tableId}`).modal("hide"); dataTable.ajax.reload(); });
			$(htmlTable).parentDOM(1).addClass("dataTableContainer");
			$(`#modalFilter${tableId}`).find("[data-name='exportContainer']").append($(htmlTable).parentDOM(2).find(".dtExport"));
			$(htmlTable).parentDOM(1).find(".dtCustomFilter").attr({"data-bs-toggle":"modal","data-bs-target":`#modalFilter${tableId}`}).html("<i class='fas fa-cog'></i>");
			$(htmlTable).parentDOM(2).find(".dt-buttons").remove();
			return dataTable;
		}
	}
}

function filterableTableFilters(modalFilterID,cmd,fields=[],htmlElement=null){
	if(cmd=="addField"){
		let filterDOM=`<li>
					<fieldset>
						<legend>Columna:</legend>
						<div>
							<select class='form-control' data-name='fieldSelect'>
								<option value='-1' data-type='-1'></option>
								${ fields.map(field=>{ return `<option value='${field.name}' data-type='${field.type}'>${field.text}</option>`;}) }
							</select>
							<button data-name='deleteField'><i class='fa fa-times'></i></button>
						</div>
						<ul data-name='filterOperations'>
							<li>
								<button data-name='addOperation'><i class='fa fa-plus-circle'></i></button>
								<select class='form-control' data-name='operationSelect'>
								${ componentsFormats.filteringOperations().map(opt=>{ return `<option value='${opt.operation}'>${opt.name}</option>`; }) }
								</select>
								<input type='text' class='form-control' placeholder='Valor'></input>
							</li>
						</ul>
					</fieldset>
				</li>`;
		$(`#${modalFilterID}`).find("[data-name='filterCotainer']").append(filterDOM);
		let newFilter=$(`#${modalFilterID}`).find("[data-name='filterCotainer']>li:last-child");
		newFilter.find("[data-name='fieldSelect']").change((event)=>{ filterableTableFilters(modalFilterID,"changeInputType",[],event.currentTarget); });
		newFilter.find("[data-name='deleteField']").click((event)=>{ filterableTableFilters(modalFilterID,"deleteField",[],event.currentTarget); });
		newFilter.find("[data-name='addOperation']").click((event)=>{ filterableTableFilters(modalFilterID,"addOperation",[],event.currentTarget); });
		newFilter.find("[data-name='operationSelect']").change((event)=>{ 
			if($(event.currentTarget).val()!=""){return;}
			$(event.currentTarget).parentDOM(1).find("input[type='text']").val("");
		});
	}

	if(cmd=="changeInputType"){
		let datatype=$(htmlElement).find(":selected").attr("data-type");
		let fieldContainer=$(htmlElement).parentDOM(3);
		if(datatype=="date"){ fieldContainer.find("[data-name='filterOperations'] input[type='text']").datetimepicker(componentsFormats.dpicker()).val(""); return; }
		fieldContainer.find("[data-name='filterOperations'] input[type='text']").datetimepicker("destroy").val("");
	}

	if(cmd=="deleteField"){
		$(htmlElement).attr("disabled",true);
		let fieldContainer=$(htmlElement).parentDOM(3);
		$(fieldContainer).find("*").off();
		fieldContainer.remove();
	}

	if(cmd=="getFilters"){
		let filterContainer=$(`#${modalFilterID}`).find(`[data-name='filterCotainer']`);
		let filters=[""];
		filterContainer.find(">li").each(function(index,htmlElement){
			let field=$(htmlElement).find("select[data-name='fieldSelect']");
			if(field.find(":selected").attr("data-type")=="-1"){return;}
			$(htmlElement).find("[data-name='filterOperations']>li").each((index,operation)=>{
				filters.push([
					index==0?"AND":"OR"
					,field.val()
					,$(operation).find(">select[data-name='operationSelect']").val()
					,$(operation).find(">input[type='text']").val()
					,field.find(":selected").attr("data-type")
				]);
			});
		});
		if(filters.length>1){filters.shift();}
		return filters;
	}

	if(cmd=="addOperation"){
		$(htmlElement).find("i").removeClass("fa-plus-circle");
		$(htmlElement).find("i").addClass("fa-times-circle");
		let operationContainer=$(htmlElement).parentDOM(2);
		let datatype=$(htmlElement).parentDOM(3).find("select[data-name='fieldSelect']").find(":selected").attr("data-type");
		$(htmlElement).attr("data-name","deleteOperation");
		$(htmlElement).off();
		$(htmlElement).click((event)=>{filterableTableFilters(modalFilterID,"deleteOperation",[],event.currentTarget);});
		operationContainer.append(`
							<li>
								<button data-name='addOperation'><i class='fa fa-plus-circle'></i></button>
								<select class='form-control' data-name='operationSelect'>
								${ componentsFormats.filteringOperations().map(opt=>{ return `<option value='${opt.operation}'>${opt.name}</option>`; }) }
								</select>
								<input type='text' class='form-control' placeholder='Valor'></input>
							</li>
		`);
		let newOperation=operationContainer.find(">li:last-child");
		newOperation.find("[data-name='addOperation']").click((event)=>{ filterableTableFilters(modalFilterID,"addOperation",[],event.currentTarget); });
		newOperation.find("[data-name='operationSelect']").change((event)=>{ 
			if($(event.currentTarget).val()!=""){return;}
			$(event.currentTarget).parentDOM(1).find("input[type='text']").val("");
		});
		if(datatype=="date"){ newOperation.find("input[type='text']").datetimepicker(componentsFormats.dpicker()).val(""); return; }
	}

	if(cmd=="deleteOperation"){
		let operation=$(htmlElement).parentDOM(1);
		operation.find("*").off();
		operation.remove();
	}
}*/

$("#dbDt").DataTable(window.componentsFormats.dtTable());