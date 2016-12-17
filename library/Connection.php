<?php

class Connection
{
    function __construct()
    {
        $this->connect();
    }

    function __destruct()
    {
        $this->close();
    }

    function connect()
    {
        //import database connections file
        require_once__Dir__ . '/db_config.php';

        //Connect to MySQL
        $connection = mysqli_connect(HOST, USER, PASSWORD, DATABASE, PORT);

        return $connection;

    }

    function close()
    {
        mysqli_close();
    }


}