<?php

namespace App\Enums;

enum EmployeeStatus: string
{
    case Available = 'Available';
    case InMeeting = 'In Meeting';
    case Busy = 'Busy';
    case Offline = 'Offline';
    case OutOfOffice = 'OOO';
}
