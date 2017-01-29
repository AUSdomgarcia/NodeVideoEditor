if($_FILES['videofile']){
    $my_file = $_FILES['videofile'];
    $my_blob = file_get_contents($my_file['tmp_name']);
    file_put_contents('your_file.webm', $my_blob);
    }