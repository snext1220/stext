<?php
ini_set('display_errors', 1);
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');
ini_set('display_errors', 1);

$path = './post/'.$_POST['key'];
print_r($_FILES);

function singleupload($file) {
    global $path;
    if (!$file) { return; }
    if(move_uploaded_file(
      $file['tmp_name'], $path.'/'.$file['name'])) {
        //
    } else {
        print('NG: Scenario');
    }
}

function multiupload($files, $sub) {
    global $path;
    if (!$files) { return; }
    for ($i = 0; $i < count($files['name']); $i++) {
        $dest = $path.$sub.'/'.$files['name'][$i];
        if(move_uploaded_file($files['tmp_name'][$i], $dest)) {
            print($files['name'][$i]."\n");
        } else {
            print('NG:'.$files['name'][$i]."\n");
        }
    }
}

if (!file_exists($path)) {
    mkdir($path, 0777);
    mkdir($path.'/bgm', 0777);
    mkdir($path.'/bgm/se', 0777);
    mkdir($path.'/capture', 0777);
}
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
//print_r($_FILES);

