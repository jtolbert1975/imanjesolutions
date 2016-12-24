<?php
/**
 * Created by PhpStorm.
 * User: jdrilla
 * Date: 11/27/16
 * Time: 6:43 PM
 * Description: REST Service for Contacts
 * URI: /api/getAllQuotes.php
 */

require_once '../library/ConnectionManager.php';

$response = array();

$db = connectionManager::getInstance();

$result = mysqli_query("SELECT * FROM quotes ") or die(mysqli_error());

if(mysqli_num_rows($result) > 0)
{
    $response["quote"] = array();

    while($row = mysqli_fetch_array($result));
    {
        $quote = array();
        $quote["id"] = $row["id"];
        $quote["f_name"] = $row["f_name"];
        $quote["l_name"] = $row["l_name"];
        $quote["email"] = $row["email"];
        $quote["phone"] = $row["phone"];
        $quote["description"] = $row["description"];
        $quote["url"] = $row["url"];
        $quote["pages"] = $row["number_pages"];
        $quote["exurl_1"] = $row["ex_url_1"];
        $quote["exurl_2"] = $row["ex_url_2"];
        $quote["exurl_3"] = $row["ex_url_3"];
        $quote["contact_id"] = $row["contact_id"];
        $quote["q_date"] = $row["quote_date"];


        array_push($response["quote"], $quote);
    }

    $response["success"] = 1;

    return json_encode($response);
} else {
    $response["success"] = 1;
    $response["message"] = "No quotes found";

    return json_encode($response);
}










