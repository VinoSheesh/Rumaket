export type RoomRole = "owner" | "caretaker";

export type ScheduleCategory =
  | "medication"
  | "meal"
  | "hygiene"
  | "vitals"
  | "therapy";

export type TimeSlot = "morning" | "afternoon" | "evening" | "custom";

export type ScheduleStatus = "pending" | "completed" | "skipped";

export type AttendanceStatus = "on_duty" | "completed";

export type NoteCategory =
  | "health_condition"
  | "behavior_change"
  | "vitals_result"
  | "shift_handover";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

export type PatientRoom = {
  id: string;
  name: string;
  patient_name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  role: RoomRole;
  created_at: string;
};

export type Schedule = {
  id: string;
  room_id: string;
  category: ScheduleCategory;
  time_slot: TimeSlot;
  specific_time: string | null;
  title: string;
  description: string | null;
  scheduled_date: string;
  status: ScheduleStatus;
  skip_reason: string | null;
  created_by: string;
  created_at: string;
};

export type Attendance = {
  id: string;
  room_id: string;
  caretaker_id: string;
  check_in_at: string;
  check_out_at: string | null;
  status: AttendanceStatus;
};

export type Note = {
  id: string;
  room_id: string;
  caretaker_id: string;
  category: NoteCategory;
  content: string;
  photo_url: string | null;
  created_at: string;
};

export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
};
