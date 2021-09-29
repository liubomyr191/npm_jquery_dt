import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/index.css";
import jQuery from "jquery";
window.jQuery = window.$ = jQuery;

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

import Navigo from "navigo";
const router = new Navigo("/");
router
.on("/",()=>{
  jQuery("#app").load("/src/pages/menu.html");
})
.resolve();