export type EventTag = "team" | "client" | "oneone" | "vendor" | "custom";

export type CalEvent = {
  id: string;
  title: string;
  detail: string;
  day: number; // 0-6 within the displayed week (Mon..Sun)
  date: number; // day of month
  start: string;
  duration: string;
  tag: EventTag;
  color: string; // token class suffix
  notes?: string;
};

export const tagLabels: Record<EventTag, string> = {
  team: "Team",
  client: "Client",
  oneone: "1:1",
  vendor: "Vendor",
  custom: "Custom",
};

export const eventColors = [
  { key: "brand", dot: "bg-brand", chip: "bg-brand/10 text-brand-deep" },
  { key: "warn", dot: "bg-warn", chip: "bg-warn/15 text-warn" },
  { key: "good", dot: "bg-good", chip: "bg-good/10 text-good" },
  { key: "danger", dot: "bg-danger", chip: "bg-danger/10 text-danger" },
  { key: "mute", dot: "bg-mute", chip: "bg-paper text-mute" },
] as const;

export const colorClasses: Record<string, { dot: string; chip: string }> = Object.fromEntries(
  eventColors.map((c) => [c.key, { dot: c.dot, chip: c.chip }]),
);

export const initialEvents: CalEvent[] = [
  {
    id: "e1",
    title: "Q3 Roadmap Sync — Product & Eng",
    detail: "Zoom · 6 attendees · prep doc attached",
    day: 2,
    date: 12,
    start: "10:30",
    duration: "25 min",
    tag: "team",
    color: "brand",
  },
  {
    id: "e2",
    title: "Client onboarding — Northwind Labs",
    detail: "Meet & greet · send contract follow-up",
    day: 2,
    date: 12,
    start: "13:00",
    duration: "45 min",
    tag: "client",
    color: "warn",
  },
  {
    id: "e3",
    title: "1:1 — Dev & Design alignment",
    detail: "In office · sprint review notes",
    day: 2,
    date: 12,
    start: "15:30",
    duration: "30 min",
    tag: "oneone",
    color: "good",
  },
  {
    id: "e4",
    title: "Vendor call — Cloudpay billing",
    detail: "Phone · confirm Q2 invoice",
    day: 2,
    date: 12,
    start: "17:00",
    duration: "15 min",
    tag: "vendor",
    color: "mute",
  },
  {
    id: "e5",
    title: "Weekly ops stand-up",
    detail: "Meet · whole team",
    day: 0,
    date: 10,
    start: "09:00",
    duration: "20 min",
    tag: "team",
    color: "brand",
  },
  {
    id: "e6",
    title: "Cobalt Freight renewal review",
    detail: "Contract walkthrough",
    day: 1,
    date: 11,
    start: "11:00",
    duration: "40 min",
    tag: "client",
    color: "warn",
  },
  {
    id: "e7",
    title: "Aster & Vale discovery call",
    detail: "New lead · qualification",
    day: 3,
    date: 13,
    start: "14:00",
    duration: "30 min",
    tag: "client",
    color: "good",
  },
  {
    id: "e8",
    title: "Board pack deadline",
    detail: "Submit Q2 summary",
    day: 4,
    date: 14,
    start: "16:00",
    duration: "60 min",
    tag: "custom",
    color: "danger",
  },
];

export type ActionItem = { id: string; label: string; due: string; done: boolean; overdue?: boolean };

export const initialActions: ActionItem[] = [
  { id: "a1", label: "Send Q2 summary to board", due: "", done: true },
  { id: "a2", label: "Confirm vendor SLA renewal", due: "Due 1:00 pm", done: false },
  { id: "a3", label: "Approve Northwind SOW", due: "Overdue", done: false, overdue: true },
  { id: "a4", label: "Draft onboarding email template", due: "Due 2:00 pm", done: false },
  { id: "a5", label: "Review Cobalt Freight pricing sheet", due: "Due 4:30 pm", done: false },
  { id: "a6", label: "Log discovery notes for Aster & Vale", due: "Due 5:00 pm", done: false },
];

export type Channel = "email" | "whatsapp" | "sms";

export type Message = {
  id: string;
  channel: Channel;
  from: string;
  company: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  unread: boolean;
  missed?: boolean;
};

export const messages: Message[] = [
  {
    id: "m1",
    channel: "email",
    from: "Daniel Reyes",
    company: "Northwind Labs",
    subject: "Re: Revised onboarding timeline",
    preview: "Can we shift the kickoff to Thursday? Happy to…",
    body: [
      "Hi Maya, can we shift the kickoff to Thursday? Our data team only finishes the migration on Wednesday evening.",
      "Happy to keep the same agenda and length. Let me know and I'll move the invite.",
    ],
    time: "09:42",
    unread: true,
  },
  {
    id: "m2",
    channel: "email",
    from: "Priya Shah",
    company: "Cloudpay",
    subject: "Invoice #4821 approved",
    preview: "Payment scheduled, thank you for the quick…",
    body: ["Payment is scheduled for Friday. Thank you for the quick turnaround on the revised lines."],
    time: "08:15",
    unread: false,
  },
  {
    id: "m3",
    channel: "email",
    from: "Lena Fischer",
    company: "Aster & Vale",
    subject: "Discovery call — a few questions first",
    preview: "Before Thursday, could you share how reporting…",
    body: [
      "Before Thursday, could you share how reporting works for multi-region teams?",
      "Also curious about the onboarding timeline once we sign.",
    ],
    time: "07:31",
    unread: true,
  },
  {
    id: "m4",
    channel: "whatsapp",
    from: "Tomás Ferreira",
    company: "Cobalt Freight",
    subject: "Renewal signature",
    preview: "Legal cleared it — sending the signed copy today",
    body: ["Legal cleared it 👍", "Sending the signed copy later today, should land before 5."],
    time: "09:05",
    unread: true,
  },
  {
    id: "m5",
    channel: "whatsapp",
    from: "Ines Rocha",
    company: "Northwind Labs",
    subject: "Kickoff room",
    preview: "We'll use the 4th floor room instead",
    body: ["We'll use the 4th floor room instead — the big one was double booked."],
    time: "08:47",
    unread: false,
  },
  {
    id: "m6",
    channel: "sms",
    from: "0400 553 112",
    company: "Northwind Labs",
    subject: "Missed call · left voicemail",
    preview: "02:14 voicemail · 07:58",
    body: ["Missed call at 07:58. Voicemail 2:14 — asking about the SOW approval."],
    time: "07:58",
    unread: true,
    missed: true,
  },
  {
    id: "m7",
    channel: "sms",
    from: "Marta Herrera",
    company: "Meridian Bank",
    subject: "Missed call",
    preview: "Two attempts, no voicemail",
    body: ["Two missed calls this morning, no voicemail left."],
    time: "08:12",
    unread: true,
    missed: true,
  },
  {
    id: "m8",
    channel: "sms",
    from: "Cloudpay",
    company: "Cloudpay",
    subject: "Verification code",
    preview: "Your billing portal code is 448 201",
    body: ["Your billing portal code is 448 201. It expires in 10 minutes."],
    time: "06:40",
    unread: false,
  },
];

export type TimelineEntry = {
  id: string;
  kind: "email" | "call" | "meeting";
  title: string;
  detail: string;
  when: string;
};

export type Contact = {
  id: string;
  name: string;
  company: string;
  role: string;
  status: string;
  initials: string;
  color: string;
  email: string;
  phone: string;
  timeline: TimelineEntry[];
};

export const contacts: Contact[] = [
  {
    id: "c1",
    name: "Daniel Reyes",
    company: "Northwind Labs",
    role: "Head of Operations",
    status: "Onboarding",
    initials: "NL",
    color: "brand",
    email: "daniel@northwindlabs.com",
    phone: "+61 400 553 112",
    timeline: [
      { id: "t1", kind: "email", title: "Re: Revised onboarding timeline", detail: "Asked to move kickoff to Thursday", when: "Today · 09:42" },
      { id: "t2", kind: "call", title: "Missed call", detail: "Voicemail 2:14 about SOW approval", when: "Today · 07:58" },
      { id: "t3", kind: "meeting", title: "Client onboarding kickoff", detail: "45 min · Meet & greet", when: "Today · 13:00" },
      { id: "t4", kind: "email", title: "SOW v3 sent", detail: "Awaiting counter-signature", when: "Mon · 16:20" },
      { id: "t5", kind: "meeting", title: "Scoping workshop", detail: "90 min · 5 attendees", when: "Last Thu · 10:00" },
    ],
  },
  {
    id: "c2",
    name: "Tomás Ferreira",
    company: "Cobalt Freight",
    role: "Commercial Director",
    status: "Renewal",
    initials: "CF",
    color: "good",
    email: "tomas@cobaltfreight.pt",
    phone: "+351 912 004 771",
    timeline: [
      { id: "t6", kind: "whatsapp" as unknown as "email", title: "Renewal signature", detail: "Legal cleared, signed copy today", when: "Today · 09:05" },
      { id: "t7", kind: "meeting", title: "Renewal review", detail: "40 min · contract walkthrough", when: "Yesterday · 11:00" },
      { id: "t8", kind: "call", title: "Outbound call", detail: "12 min · pricing tiers discussed", when: "Mon · 14:35" },
      { id: "t9", kind: "email", title: "Renewal quote 2026", detail: "3-year term, 8% uplift", when: "Fri · 09:12" },
    ],
  },
  {
    id: "c3",
    name: "Lena Fischer",
    company: "Aster & Vale",
    role: "Founder",
    status: "New lead",
    initials: "AV",
    color: "warn",
    email: "lena@asterandvale.de",
    phone: "+49 151 2233 908",
    timeline: [
      { id: "t10", kind: "email", title: "Discovery call — a few questions first", detail: "Reporting for multi-region teams", when: "Today · 07:31" },
      { id: "t11", kind: "meeting", title: "Discovery call", detail: "30 min · qualification", when: "Tomorrow · 14:00" },
      { id: "t12", kind: "email", title: "Intro from Cobalt Freight", detail: "Warm referral", when: "Last week" },
    ],
  },
  {
    id: "c4",
    name: "Marta Herrera",
    company: "Meridian Bank",
    role: "Procurement Lead",
    status: "At risk",
    initials: "MB",
    color: "danger",
    email: "m.herrera@meridianbank.es",
    phone: "+34 600 118 442",
    timeline: [
      { id: "t13", kind: "call", title: "2 missed calls", detail: "No voicemail left", when: "Today · 08:12" },
      { id: "t14", kind: "email", title: "Security questionnaire", detail: "Response overdue by 2 days", when: "Mon · 11:04" },
      { id: "t15", kind: "meeting", title: "Compliance review", detail: "60 min · 4 attendees", when: "Last Wed · 15:00" },
    ],
  },
  {
    id: "c5",
    name: "Priya Shah",
    company: "Cloudpay",
    role: "Account Manager",
    status: "Vendor",
    initials: "CP",
    color: "mute",
    email: "priya@cloudpay.io",
    phone: "+44 7700 900 221",
    timeline: [
      { id: "t16", kind: "email", title: "Invoice #4821 approved", detail: "Payment scheduled Friday", when: "Today · 08:15" },
      { id: "t17", kind: "meeting", title: "Vendor call — billing", detail: "15 min · confirm Q2 invoice", when: "Today · 17:00" },
    ],
  },
];
