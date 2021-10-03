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
const router = new Navigo("/");
router
.on("/",()=>{
  $("#app").load("/src/pages/menu.html");
})
.resolve();