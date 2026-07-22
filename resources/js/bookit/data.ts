import { Appointment, Employee, ActivityLog, OfficeSettings } from './types';

// Helper to get formatted dates relative to today
export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Jenkins',
    role: 'VP of Product',
    initials: 'SJ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD78_MCeIAeWHIrVC0IbGOLzteIaSXbfbmVHTjbQF6jYqQW6V5hHPUjSQ108EPglBPbSxtAThQwxD4X6LEUItmdPMtaw7I7R1srUNMhdJM33TrCpe1ED0x2kizNcpM_DOj7bpYgv38Hl_t_ahyi-t-R6ukYAs_8sAjBzCdazStV1FHzrAIPpbkUPrc5uPkK6u6KCzhk_vwTqpET7Ya0aRiADsNOuNALTpRmsUlvgF2tarZx9kWuwAV17w',
    status: 'In Meeting',
    statusDetails: 'until 12:30 PM',
    meetingsCount: 42,
    punctuality: 98,
    avgDuration: 45,
    agendaCompletion: 92
  },
  {
    id: 'emp-2',
    name: 'Michael Chen',
    role: 'Design Director',
    initials: 'MC',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXb3IvZAbA0ZWs-o4PhhkiWekvhI9yu8rQbZDXBkj-3CY3VPU7hpsf27rVYHlkNblcRezq3qWpYV__ozYQTNP42Skgm5n1StPVwO-cbTKzLxirrBdPdOEyzNRIBv5f56FWgxMWhq6yHDvkKpk5DFJ9I1Ijnkfub3nHSYP92gAOWFPtS2YDosbw9KFvxZ_vYYD5Q54zG4mKIyembwKGRrSWtabAjPll0nquIAHGsq07SLihkvNQweKPOg',
    status: 'Busy',
    statusDetails: 'in Design Review',
    meetingsCount: 38,
    punctuality: 95,
    avgDuration: 52,
    agendaCompletion: 88
  },
  {
    id: 'emp-3',
    name: 'Emily Davis',
    role: 'Operations Lead',
    initials: 'ED',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZHNNAMYGPt26Ifx1AWcAEHJLh44TCPNxRl3XvcAyVAyQwKBRBYXn7iaro0XZ4kfGhBp3DeCJntRSe9fImLbHjOAu2Fb5-wSB7CJJHf_P0-NBfXhVPYq67puN6jEK9IZNaP02TTd_aRCIZtR6MKgAPiUQvD2zOMR25wnOMMICusxU9INGOrulwaNBQuGOQ8aLV2hPEDG3J751eKXw0imzLWyVuQRtAFf5sr5_u15YbyCUOOdzV3LqRcw',
    status: 'Available',
    meetingsCount: 29,
    punctuality: 82,
    avgDuration: 35,
    agendaCompletion: 75
  },
  {
    id: 'emp-4',
    name: 'Alex Mercer',
    role: 'Senior Product Manager',
    initials: 'AM',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZLFOL9zNCWrQ8kUX3ufDDXaVMbLIf2Ee9XRR4_tySrMcxc6JG2j5gNsr7e1tcf5II5uiQHkFe1dXNFtY1S9mIBk-uo-u7SyDW9uh3rWiN8qWT7QIIAVJYIAPpI8ZqPM1cp1-RlLJDnGH5xNsrq3VfFXP-aM5tREQIKzm4BUzznhRwxkWulOkmU2hSfHyc7L6JEDWj-877zO8k_fFBTr2TSTDuISFaW99IEz5w-etGL2yqwWKQswHnnA',
    status: 'In Meeting',
    statusDetails: 'until 11:00 AM',
    meetingsCount: 31,
    punctuality: 91,
    avgDuration: 40,
    agendaCompletion: 85
  },
  {
    id: 'emp-5',
    name: 'Jessica Lin',
    role: 'Account Manager',
    initials: 'JL',
    status: 'Available',
    meetingsCount: 25,
    punctuality: 94,
    avgDuration: 30,
    agendaCompletion: 80
  },
  {
    id: 'emp-6',
    name: 'Thomas Wright',
    role: 'HR Specialist',
    initials: 'TW',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYz0_npOsXJYtCzpnn4t5UR4P2LGx20epECo9iusQXVXvoUIotvWFdBM5bRyH3m0AJ5N75Pa_69cJGuGPhYuHrsv8EZXn3QKJHlRe_yrPUPcOLHWvEZdrV-NejQBjyJfgMwseXHTuZogq3GgR0Q7eouddntW_MJ1J0KLTgleYFWK4kapcehWznxTakmphCRYb1c2JsaFw3MdJdjfmnqiCcwucePTYbYDy_YYUhEzTx1H8dXKGfpbF26g',
    status: 'Offline',
    statusDetails: 'Offline / OOO',
    meetingsCount: 18,
    punctuality: 89,
    avgDuration: 42,
    agendaCompletion: 82
  },
  {
    id: 'emp-7',
    name: 'Mike Johnson',
    role: 'Engineering Lead',
    initials: 'MJ',
    status: 'Available',
    meetingsCount: 34,
    punctuality: 87,
    avgDuration: 48,
    agendaCompletion: 84
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Today's Meetings
  {
    id: 'appt-1',
    title: 'Annual Review - Design Team',
    visitorName: 'Design Team Review',
    visitorCompany: 'BookIt Internal',
    hostId: 'emp-2', // Michael Chen
    hostName: 'Michael Chen',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    room: 'Conference Room A',
    status: 'Ongoing',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Performance evaluation and review of design deliverables for Q3.'
  },
  {
    id: 'appt-2',
    title: 'Vendor Pitch: Global Logistics',
    visitorName: 'Sarah Jenkins (External)',
    visitorCompany: 'Global Logistics Corp',
    hostId: 'emp-3', // Emily Davis
    hostName: 'Emily Davis',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    room: 'Room 402',
    status: 'Pending',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Introduction and initial proposal regarding enterprise supply chain solutions.'
  },
  {
    id: 'appt-3',
    title: 'John Doe - Acme Corp Visit',
    visitorName: 'John Doe',
    visitorCompany: 'Acme Corp',
    hostId: 'emp-1', // Sarah Jenkins
    hostName: 'Sarah Jenkins',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    room: 'Room 301',
    status: 'Starting Soon',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Client account setup and verification discussion.'
  },
  {
    id: 'appt-4',
    title: 'Freelance Design Sync',
    visitorName: 'Alice Smith',
    visitorCompany: 'Freelance',
    hostId: 'emp-7', // Mike Johnson
    hostName: 'Mike Johnson',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    room: 'Office 2',
    status: 'In Progress',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Sync regarding front-end components development contract.'
  },
  {
    id: 'appt-5',
    title: 'Bob Williams - Contract Discussion',
    visitorName: 'Bob Williams',
    visitorCompany: 'Tech Solutions',
    hostId: 'emp-3', // Emily Davis
    hostName: 'Emily Davis',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    room: 'Room 204',
    status: 'Expected',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Finalizing hardware service levels.'
  },
  {
    id: 'appt-6',
    title: 'Private Executive Booking',
    visitorName: 'Confidential',
    visitorCompany: 'Private',
    hostId: 'emp-1', // Sarah Jenkins
    hostName: 'Sarah Jenkins',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    room: 'Board Room A',
    status: 'Booked',
    date: getRelativeDateString(0),
    isPrivate: true,
    notes: 'Closed board meeting.'
  },
  {
    id: 'appt-7',
    title: 'Q3 Strategy Review',
    visitorName: 'Sarah Jenkins (VP)',
    visitorCompany: 'Corporate',
    hostId: 'emp-4', // Alex Mercer
    hostName: 'Alex Mercer',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    room: 'Boardroom A',
    status: 'Ongoing',
    date: getRelativeDateString(0),
    isPrivate: true,
    notes: 'Strategic planning and direct reports overview.'
  },
  {
    id: 'appt-8',
    title: 'Vendor Negotiation: TechCorp',
    visitorName: 'David Lee',
    visitorCompany: 'TechCorp Solutions',
    hostId: 'emp-2', // Michael Chen
    hostName: 'Michael Chen',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Meeting Room 3',
    status: 'Pending',
    date: getRelativeDateString(0),
    isPrivate: false,
    notes: 'Price modeling for software components.'
  },

  // Tomorrow's Meetings
  {
    id: 'appt-9',
    title: 'Q3 Planning Sync',
    visitorName: 'Sarah Jenkins (VP)',
    visitorCompany: 'BookIt',
    hostId: 'emp-4', // Alex Mercer
    hostName: 'Alex Mercer',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    room: 'Boardroom A',
    status: 'Expected',
    date: getRelativeDateString(1),
    isPrivate: false
  },
  {
    id: 'appt-10',
    title: 'Client Onboarding',
    visitorName: 'Jane Peterson',
    visitorCompany: 'Acme Logistics',
    hostId: 'emp-3', // Emily Davis
    hostName: 'Emily Davis',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Room 402',
    status: 'Expected',
    date: getRelativeDateString(1),
    isPrivate: false
  },

  // Later Meetings
  {
    id: 'appt-11',
    title: '1:1 Check-in',
    visitorName: 'Emily Davis',
    visitorCompany: 'BookIt Internal',
    hostId: 'emp-1', // Sarah Jenkins
    hostName: 'Sarah Jenkins',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    room: 'Room 102',
    status: 'Expected',
    date: getRelativeDateString(2), // Wed, 2:00 PM
    isPrivate: false
  },
  {
    id: 'appt-12',
    title: 'Partner Roadmap Review',
    visitorName: 'Kenji Sato',
    visitorCompany: 'Sato Consulting',
    hostId: 'emp-1', // Sarah Jenkins
    hostName: 'Sarah Jenkins',
    startTime: '03:30 PM',
    endTime: '04:30 PM',
    room: 'Boardroom A',
    status: 'Expected',
    date: getRelativeDateString(3),
    isPrivate: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'checkout',
    user: 'Sarah Smith',
    message: 'checked out.',
    timestamp: '10 mins ago',
    timeISO: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'act-2',
    type: 'invite',
    user: 'HR Dept',
    message: 'New meeting invite from HR Dept.',
    timestamp: '25 mins ago',
    timeISO: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'act-3',
    type: 'late',
    user: 'Tom Clark',
    message: 'Visitor Tom Clark is late.',
    timestamp: '1 hour ago',
    timeISO: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act-4',
    type: 'checkin',
    user: 'John Doe',
    message: 'checked in at reception.',
    timestamp: '2 hours ago',
    timeISO: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

export const INITIAL_SETTINGS: OfficeSettings = {
  workingHoursStart: '08:00 AM',
  workingHoursEnd: '06:00 PM',
  lockTimeEnabled: false,
  notifyOnLate: true,
  autoCheckout: true,
  defaultMeetingDuration: 60
};
