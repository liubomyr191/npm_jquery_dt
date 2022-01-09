let sql = "SELECT ID,First_name,Last_name,Age,Birth_date FROM DataTables";
let dt = filterableTable($("#dbDt"), "https://php-db-server.000webhostapp.com/backend/DataTables/", sql);
dt = dt.initTable();
