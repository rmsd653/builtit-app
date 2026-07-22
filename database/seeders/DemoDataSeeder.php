<?php

namespace Database\Seeders;

use App\Enums\ActivityLogType;
use App\Enums\AppointmentStatus;
use App\Enums\EmployeeStatus;
use App\Enums\SystemRole;
use App\Models\ActivityLog;
use App\Models\Appointment;
use App\Models\OfficeSetting;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Settings
        OfficeSetting::create([
            'working_hours_start' => '08:00',
            'working_hours_end' => '18:00',
            'lock_time_enabled' => false,
            'notify_on_late' => true,
            'auto_checkout' => true,
            'default_meeting_duration' => 60,
        ]);

        // Create Admin
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@bookit.com',
            'password' => bcrypt('password123'),
        ]);

        // Create Employees
        $sarah = User::factory()->manager()->create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah.jenkins@bookit.com',
            'password' => bcrypt('password123'),
            'display_role' => 'VP of Product',
            'initials' => 'SJ',
            'status' => EmployeeStatus::InMeeting,
            'status_details' => 'until 12:30 PM',
            'avatar_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        ]);

        $michael = User::factory()->employee()->create([
            'name' => 'Michael Chen',
            'email' => 'michael.chen@bookit.com',
            'password' => bcrypt('password123'),
            'display_role' => 'Design Director',
            'initials' => 'MC',
            'status' => EmployeeStatus::Busy,
            'status_details' => 'in Design Review',
            'manager_id' => $sarah->id,
        ]);

        $emily = User::factory()->receptionist()->create([
            'name' => 'Emily Davis',
            'email' => 'emily.davis@bookit.com',
            'password' => bcrypt('password123'),
            'display_role' => 'Operations Lead',
            'initials' => 'ED',
            'status' => EmployeeStatus::Available,
            'manager_id' => $sarah->id,
        ]);

        $alex = User::factory()->employee()->create([
            'name' => 'Alex Mercer',
            'email' => 'alex@bookit.com',
            'display_role' => 'Senior Product Manager',
            'initials' => 'AM',
            'status' => EmployeeStatus::InMeeting,
            'status_details' => 'until 11:00 AM',
            'manager_id' => $sarah->id,
        ]);

        $jessica = User::factory()->employee()->create([
            'name' => 'Jessica Lin',
            'email' => 'jessica@bookit.com',
            'display_role' => 'Account Manager',
            'initials' => 'JL',
            'status' => EmployeeStatus::Available,
        ]);

        $thomas = User::factory()->employee()->create([
            'name' => 'Thomas Wright',
            'email' => 'thomas@bookit.com',
            'display_role' => 'HR Specialist',
            'initials' => 'TW',
            'status' => EmployeeStatus::Offline,
            'status_details' => 'Offline / OOO',
        ]);

        $mike = User::factory()->employee()->create([
            'name' => 'Mike Johnson',
            'email' => 'mike@bookit.com',
            'display_role' => 'Engineering Lead',
            'initials' => 'MJ',
            'status' => EmployeeStatus::Available,
        ]);

        // Visitors & Appointments
        // Today Appointments
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();
        $nextWeek = Carbon::today()->addDays(7);

        // 1. Alex Mercer - Morning Sync (Ongoing)
        $visitor1 = Visitor::factory()->create([
            'name' => 'David Kim',
            'company' => 'TechFlow',
            'email' => 'david@techflow.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Product Sync',
            'host_id' => $alex->id,
            'visitor_id' => $visitor1->id,
            'date' => $today,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'room' => 'Conference Room A',
            'status' => AppointmentStatus::Ongoing,
            'notes' => 'Discuss Q3 roadmap',
        ]);

        // 2. Sarah Jenkins - Q3 Planning (Ongoing)
        $visitor2 = Visitor::factory()->create([
            'name' => 'Rachel Green',
            'company' => 'Innovate Inc',
            'email' => 'rachel@innovate.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Q3 Planning Strategy',
            'host_id' => $sarah->id,
            'visitor_id' => $visitor2->id,
            'date' => $today,
            'start_time' => '11:30',
            'end_time' => '12:30',
            'room' => 'Boardroom A',
            'status' => AppointmentStatus::Ongoing,
            'is_private' => true,
        ]);

        // 3. Michael Chen - Design Review (Scheduled/Starting Soon)
        $visitor3 = Visitor::factory()->create([
            'name' => 'Liam Smith',
            'company' => 'Creative Agency',
            'email' => 'liam@creative.com'
        ]);
        Appointment::factory()->create([
            'title' => 'UI/UX Design Review',
            'host_id' => $michael->id,
            'visitor_id' => $visitor3->id,
            'date' => $today,
            'start_time' => '13:00',
            'end_time' => '14:30',
            'room' => 'Room 301',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // 4. Mike Johnson - Technical Interview (Scheduled)
        $visitor4 = Visitor::factory()->create([
            'name' => 'Emma Wilson',
            'company' => 'Candidate',
            'email' => 'emma.w@email.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Senior Backend Engineer Interview',
            'host_id' => $mike->id,
            'visitor_id' => $visitor4->id,
            'date' => $today,
            'start_time' => '14:00',
            'end_time' => '15:00',
            'room' => 'Room 102',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // 5. Jessica Lin - Client Onboarding (Scheduled)
        $visitor5 = Visitor::factory()->create([
            'name' => 'Robert Taylor',
            'company' => 'Global Corp',
            'email' => 'robert@globalcorp.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Global Corp Onboarding',
            'host_id' => $jessica->id,
            'visitor_id' => $visitor5->id,
            'date' => $today,
            'start_time' => '15:30',
            'end_time' => '17:00',
            'room' => 'Conference Room A',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // Tomorrow Appointments
        // 6. Sarah Jenkins - Investor Meeting
        $visitor6 = Visitor::factory()->create([
            'name' => 'Marcus Wong',
            'company' => 'Venture Partners',
            'email' => 'marcus@vp.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Series B Discussion',
            'host_id' => $sarah->id,
            'visitor_id' => $visitor6->id,
            'date' => $tomorrow,
            'start_time' => '10:00',
            'end_time' => '11:30',
            'room' => 'Boardroom A',
            'status' => AppointmentStatus::Scheduled,
            'is_private' => true,
        ]);

        // 7. Emily Davis - Vendor Sync
        $visitor7 = Visitor::factory()->create([
            'name' => 'Sophie Martin',
            'company' => 'SupplyCo',
            'email' => 'sophie@supplyco.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Office Supplies Renewal',
            'host_id' => $emily->id,
            'visitor_id' => $visitor7->id,
            'date' => $tomorrow,
            'start_time' => '11:00',
            'end_time' => '11:45',
            'room' => 'Room 204',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // 8. Alex Mercer - Feature Kickoff
        $visitor8 = Visitor::factory()->create([
            'name' => 'James Brown',
            'company' => 'AppDev Inc',
            'email' => 'james@appdev.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Mobile App Feature Kickoff',
            'host_id' => $alex->id,
            'visitor_id' => $visitor8->id,
            'date' => $tomorrow,
            'start_time' => '14:00',
            'end_time' => '15:30',
            'room' => 'Room 301',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // 9. Jessica Lin - Account Review
        $visitor9 = Visitor::factory()->create([
            'name' => 'Olivia Garcia',
            'company' => 'Retail Plus',
            'email' => 'olivia@retailplus.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Q2 Account Review',
            'host_id' => $jessica->id,
            'visitor_id' => $visitor9->id,
            'date' => $tomorrow,
            'start_time' => '16:00',
            'end_time' => '17:00',
            'room' => 'Room 402',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // Next Week Appointments
        // 10. Michael Chen - Brand Workshop
        $visitor10 = Visitor::factory()->create([
            'name' => 'William Davis',
            'company' => 'Brand Studios',
            'email' => 'will@brandstudios.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Brand Refresh Workshop',
            'host_id' => $michael->id,
            'visitor_id' => $visitor10->id,
            'date' => $nextWeek,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'room' => 'Conference Room A',
            'status' => AppointmentStatus::Scheduled,
            'notes' => 'Lunch will be provided',
        ]);

        // 11. Thomas Wright - Benefit Seminar
        $visitor11 = Visitor::factory()->create([
            'name' => 'Isabella Martinez',
            'company' => 'Health Plus',
            'email' => 'isabella@healthplus.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Employee Benefits Review',
            'host_id' => $thomas->id,
            'visitor_id' => $visitor11->id,
            'date' => $nextWeek,
            'start_time' => '13:00',
            'end_time' => '14:00',
            'room' => 'Room 102',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // 12. Mike Johnson - Architecture Sync
        $visitor12 = Visitor::factory()->create([
            'name' => 'Alexander White',
            'company' => 'Cloud Systems',
            'email' => 'alex@cloudsystems.com'
        ]);
        Appointment::factory()->create([
            'title' => 'Infrastructure Migration Plan',
            'host_id' => $mike->id,
            'visitor_id' => $visitor12->id,
            'date' => $nextWeek,
            'start_time' => '15:00',
            'end_time' => '16:30',
            'room' => 'Boardroom A',
            'status' => AppointmentStatus::Scheduled,
        ]);

        // Activity Logs
        ActivityLog::factory()->create([
            'type' => ActivityLogType::Checkin,
            'user_id' => $sarah->id,
            'user_name' => $sarah->name,
            'message' => 'Rachel Green (Innovate Inc) checked in at reception.',
            'created_at' => Carbon::now()->subMinutes(15),
        ]);

        ActivityLog::factory()->create([
            'type' => ActivityLogType::Checkin,
            'user_id' => $alex->id,
            'user_name' => $alex->name,
            'message' => 'David Kim (TechFlow) checked in at reception.',
            'created_at' => Carbon::now()->subMinutes(45),
        ]);

        ActivityLog::factory()->create([
            'type' => ActivityLogType::Created,
            'user_id' => $emily->id,
            'user_name' => $emily->name,
            'message' => 'New appointment created for Tomorrow at 11:00 AM.',
            'created_at' => Carbon::now()->subHours(2),
        ]);

        ActivityLog::factory()->create([
            'type' => ActivityLogType::Checkout,
            'user_id' => $michael->id,
            'user_name' => $michael->name,
            'message' => 'Previous visitor checked out.',
            'created_at' => Carbon::now()->subHours(3),
        ]);
    }
}
