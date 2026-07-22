<?php

namespace App\Enums;

enum ActivityLogType: string
{
    case Checkout = 'checkout';
    case Invite = 'invite';
    case Late = 'late';
    case Checkin = 'checkin';
    case Created = 'created';
}
