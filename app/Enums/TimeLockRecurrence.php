<?php

namespace App\Enums;

enum TimeLockRecurrence: string
{
    case None = 'none';
    case Daily = 'daily';
    case Weekly = 'weekly';
    case Custom = 'custom';
}
