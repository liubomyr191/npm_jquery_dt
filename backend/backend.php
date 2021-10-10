<?php
include ("../config/db.php"); //your php file that creates the conection to the database
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");
//parse_str(urldecode(iconv("windows-1251", "UTF-8", file_get_contents("php://input"))), $dtData);
//echo print_r($dtData["columns"]);
$db=new db();
$con=$db->dbConnect();
if(!$con["status"]){echo json_encode($con);return;} //if could not connect to the database will return the error.
$con=$con["con"]; //get the database connection
$sql="SELECT ID,First_name,Last_name,Age,Birth_date FROM DataTables";
$query=$con->prepare($sql);
$query->execute();
$totalFiltered=$totalRows=$query->rowCount();

if(isset($_REQUEST["filters"])){
  $sql.=" WHERE 1 AND (";
  foreach($_REQUEST["filters"] as $fieldIndex=>$field){
    $sql.=($fieldIndex==0?"(":" AND (");
    foreach($field["operation"] as $opIndex=>$operation){
      $sql.=($opIndex==0?" ":" OR ").$field["name"]." ".$operation["condition"]." ".$operation["value"];
    }
    $sql.=")";
  }
  $sql.=")";
  $query=$con->prepare($sql);
  $query->execute();
  $totalFiltered=$query->rowCount();
}

if(!empty($_REQUEST["search"]["value"])){
    $sql.=(!isset($_REQUEST["filters"])?" WHERE 1 ":" ")."AND (";
    foreach($_REQUEST["columns"] as $index=>$value){
        if($value["name"]==-1){continue;}
        $sql.=($index==0?" ":" OR ").$value["name"]." LIKE '%" . $_REQUEST["search"]["value"] . "%'";
    }
    $sql.=" )";
    $query=$con->prepare($sql);
    $query->execute();
    $totalFiltered=$query->rowCount();
}

if(isset($_REQUEST["order"])){
  $sql.=" ORDER BY ".$_REQUEST["columns"][$_REQUEST["order"][0]["column"]]["name"]." ".$_REQUEST["order"][0]["dir"];
}

if($dtParam["start"]!=-1){
  $sql.=" LIMIT {$_REQUEST['start']},{$_REQUEST['length']}";
}

$query=$con->prepare($sql);
$query->execute();
$json_data["data"]=[];

foreach($query->fetchAll(PDO::FETCH_NUM) as $row){
  $json_data["data"][]=$row;
}

$con=null;
$json_data["draw"]=$_REQUEST["draw"];
$json_data["recordsTotal"]=$totalRows;
$json_data["recordsFiltered"]=$totalFiltered;
echo json_encode($json_data);

?>