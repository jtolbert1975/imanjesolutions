<?php
/**
 * Created by PhpStorm.
 * User: jdrilla
 * Date: 11/27/16
 * Time: 6:43 PM
 * Description: REST Service for Contacts
 * URI: /api/getAllContacts.php
 */

header("Access-Control-Allow-Origin: *");
require_once '../library/ConnectionManager.php';


$response = array();

$db = connectionManager::getInstance();

$result = mysqli_query("SELECT * FROM contacts ") or die(mysqli_error());

    if(mysqli_num_rows($result) > 0)
    {
        $response["contact"] = array();

        while($row = mysqli_fetch_array($result));
        {
            $contact = array();
            $contact["id"] = $row["id"];
            $contact["f_name"] = $row["first_name"];
            $contact["l_name"] = $row["last_name"];
            $contact["email"] = $row["email"];
            $contact["phone"] = $row["phone"];
            $contact["c_method"] = $row["contact_method"];
            $contact["request"] = $row["request"];
            $contact["c_date"] = $row["contact_date"];

            array_push($response["contact"], $contact);
        }

        $response["success"] = 1;

        return json_encode($response);
    } else {
        $response["success"] = 1;
        $response["message"] = "No contacts found";

        return json_encode($response);
    }






//Process Get Request
function getContacts() {

}



