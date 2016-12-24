<?php

require_once 'Connection.php';

class ConnectionManager
{
    static $connection = null;
    public static function getInstance()
    {
        if(ConnectionManager::$connection == null){
            ConnectionManager::$connection = new Connection();
        return ConnectionManager::$connection;
        }
    }

    private function __construct()
    {
        //private constructor so no one can instantiate more than one connection!
    }

    private function __clone()
    {
        //private clone, so no one can clone the connection!
        // TODO: Implement __clone() method.
    }
}

