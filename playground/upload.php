<?php
ini_set('display_errors', 1);
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');

function remove_directory($dir) {
    $files = array_diff(scandir($dir), [ '.', '..' ]);
    foreach ($files as $file) {
        if (is_dir("$dir/$file")) {
            remove_directory("$dir/$file");
        } else {
            unlink("$dir/$file");
        }
    }
    return rmdir($dir);
}

function singleupload($file) {
    global $path;
    if (!$file) { return; }
    if(move_uploaded_file(
      $file['tmp_name'], $path.'/'.$file['name'])) {
        //
    } else {
        $success = false;
    }
}

function multiupload($files, $sub) {
    global $path;
    if (!$files) { return; }
    for ($i = 0; $i < count($files['name']); $i++) {
        $dest = $path.$sub.'/'.$files['name'][$i];
        if(move_uploaded_file($files['tmp_name'][$i], $dest)) {
            //print($files['name'][$i]."\n");
        } else {
            //print('NG:'.$files['name'][$i]."\n");
            $success = false;
        }
    }
}

$success = true;
if (!preg_match('/^[0-9a-z]{8,}$/i', $_POST['key'], $data)) {
    die();
}
$path = './post/'.$_POST['key'];

// フォルダーが存在する場合は削除
if (file_exists($path)) {
    remove_directory($path);
}
// フォルダーを再作成
mkdir($path, 0777);
mkdir($path.'/bgm', 0777);
mkdir($path.'/bgm/se', 0777);
mkdir($path.'/capture', 0777);

// 基本情報を記録
file_put_contents($path.'/data.dat',
    $_POST['key'] . "\n" .
    $_POST['email'] . "\n" .
    $_POST['tag'] . "\n" .
    $_POST['level'] . "\n" .
    '----' . "\n" .
    $_POST['intro'] . "\n" .
    '----' . "\n" .
    $_POST['comment']);

singleupload($_FILES['scenario']);
multiupload($_FILES['bgms'], '/bgm');
multiupload($_FILES['ses'], '/bgm/se');
multiupload($_FILES['pics'], '/capture');
if ($success) {
    header('Location: https://wings.msn.to/stext_mail.php?email='.$_POST['email']);
    exit;
} else {
    header("HTTP/1.1 500 Internal Server Error");
}

