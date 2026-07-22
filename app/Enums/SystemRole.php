<?php

namespace App\Enums;

enum SystemRole: string
{
    case Admin = 'admin';
    case Manager = 'manager';
    case Employee = 'employee';
    case Receptionist = 'receptionist';
}
