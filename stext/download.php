<?php
$file = $_GET['id'].'-'.(time()).'.stext';
header("Content-Type: application/force-download");
header('Content-Disposition: attachment; filename='.$file);
echo $_GET['data'];