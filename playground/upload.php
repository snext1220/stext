<?php
ini_set('display_errors', 1);
ini_set('output_buffering', 4096);
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

function checkExtention($name) {
    $perms = [ 'xml', 'png', 'jpg', 'jpeg', 'mp3' ];
    $ext = pathinfo($name);
    if (!in_array(strtolower($ext['extension']), $perms)) {
        return false;
    }
    return true;
}

function singleupload($file) {
    global $path, $success;
    if (!$file) { return; }
    if (!checkExtention($file['name'])) {
        $success = false;
        return;
    }
    if(move_uploaded_file(
      $file['tmp_name'], $path.'/'.$file['name'])) {
        //
    } else {
        $success = false;
    }
}

function multiupload($files, $sub) {
    global $path, $success;
    if (!$files) { return; }
    for ($i = 0; $i < count($files['name']); $i++) {
        if (!checkExtention($files['name'][$i])) {
            $success = false;
        }
        $dest = $path.$sub.'/'.$files['name'][$i];
        if(move_uploaded_file($files['tmp_name'][$i], $dest)) {
            print($files['name'][$i]."\n");
        } else {
            print('NG:'.$files['name'][$i]."\n");
            $success = false;
        }
    }
}

$success = true;
if (empty($_POST) && $_SERVER["REQUEST_METHOD"] === "POST") {
    print('NG: Upload size is exceeded!!');
    $success = false;
} else if (!preg_match('/^[0-9a-z]{8,}$/i', $_POST['key'], $data)) {
    print('NG: Security Error!!');
    $success = false;
} else {
    $path = '../stext/'.$_POST['key'];

    // フォルダーが存在する場合は削除
    // if (file_exists($path)) {
    //     remove_directory($path);
    // }
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
}

var_dump($success);
if ($success) {
    header('Location: https://wings.msn.to/stext_mail.php?email='.$_POST['email'].'&key='.$_POST['key']);
    die();
} else {
    header('HTTP', true, 500);
}

