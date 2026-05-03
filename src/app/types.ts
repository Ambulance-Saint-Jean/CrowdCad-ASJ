class AutoAssign {
  constructor(data: Record<string, unknown>) {
    Object.assign(this, data);
  }
}

export type Post =
  | string
  | {
    name: string;
    x: number | null; // percentage of width
    y: number | null; // percentage of height
  };

export interface Layer {
  id: string;
  name: string;
  mapUrl?: string;
  posts: Post[];
}

export interface Venue {
  id: string;
  name: string;
  equipment: Equipment[];
  layers?: Layer[];
  posts?: Post[];
  mapUrl?: string;
  userId: string;
  sharedWith?: string[]; // Array of emails
}

export class Event extends AutoAssign {
  id!: string;
  name!: string;
  date!: string;
  venue!: Venue;
  sharedWith?: string[]; // Array of emails
  postingTimes!: string[];
  staff!: Staff[];
  supervisor!: Supervisor[];
  userId!: string;
  calls!: Call[];
  status?: 'draft' | 'active';
  createdAt?: string | number;
  pendingAssignments?: {
    [team: string]: { post: string; time: string };
  };
  eventPosts!: Post[];
  eventEquipment!: EventEquipment[];
  ended?: boolean;
  postAssignments?: PostAssignment;

  postingStart?: string | number;
  postingEnd?: string | number;
  scheduleStart?: string | number;
  scheduleEnd?: string | number;
  startTime?: string | number;
  endTime?: string | number;
  start?: string | number;
  end?: string | number;

  interactionSessions?: InteractionSession[];


  addEventEquipment(eventEq: EventEquipment): void {
    const existing = (this.eventEquipment || []).find(eq => eq.name === eventEq.name);
    console.log("existing", existing)

    let updatedEventEquipment: EventEquipment[] = this.eventEquipment ? [...this.eventEquipment] : [];

    console.log("updatedEventEquipment", updatedEventEquipment)

    if (existing) {
      updatedEventEquipment = updatedEventEquipment.map((eq: EventEquipment) =>
        eq.name === eventEq.name ? { ...eq, status: eventEq.status } : eq
      );
    } else {
      const venueEq = (this.venue?.equipment || []).find(v => (typeof v === 'string' ? v : v.name) === eventEq.name);
      const derivedLocation = typeof venueEq === 'string' ? '' : (venueEq && (venueEq as { location?: string }).location) || '';

      const newItem = new EventEquipment(eventEq.name, eventEq.status, null, derivedLocation)
      updatedEventEquipment.push(newItem);
    }

    this.eventEquipment = [...updatedEventEquipment]
  }

  // set(attr: keyof Event, value: any): Event {
  //   Object.defineProperty(this, attr, {
  //     value: value,
  //     writable: true,
  //     enumerable: true,
  //     configurable: true,
  //   });

  //   return this
  // }

  // add<T>(attr: keyof Event, value: T | T[]): Event {
  //   if (!this[attr] || !Array.isArray(this[attr])) {
  //     throw Error("Cannot add to undefined/null/not array object")
  //   }

  //   const oldValue = this[attr] as T[]
  //   let newValue

  //   if (Array.isArray(value)) {
  //     newValue = oldValue.concat(value)
  //   } else {
  //     newValue = [...oldValue]
  //     newValue.push(value)
  //   }

  //   Object.defineProperty(this, attr, {
  //     value: newValue,
  //     writable: true,
  //     enumerable: true,
  //     configurable: true,
  //   });

  //   return this
  // }

  sortCallsByPriority(asc: boolean): Event {
    this.calls = this.calls.sort((a, b) => asc ? a.priority.id - b.priority.id : b.priority.id - a.priority.id)
    return this
  }
}

export interface TeamLogEntry {
  timestamp: number;
  message: string;
}

export interface Staff {
  team: string;
  location: string;
  status: string;
  members: string[];
  log?: TeamLogEntry[];
  originalPost?: string;
}

export interface Supervisor {
  team: string;
  location: string;
  status: string;
  member: string;
  log?: TeamLogEntry[];
  originalPost?: string;
}

export type PostAssignment = {
  [time: string]: {
    [post: string]: string;
  };
};

interface DetachedTeam {
  team: string;
  reason: string;
}

export type ClinicOutcome = "Discharged" | "AMA" | "Rolled from Clinic" | "Transported";

interface _Call {
  location: string;
  source: string;
  age: string;
  gender: string;
  chiefComplaint: string;
  priority: Priority
}

export class QuickCall implements _Call {
  location: string;
  source: string;
  age: string;
  gender: string;
  chiefComplaint: string;
  priority: Priority;
  assignedTeam: string;

  constructor(location: string, source: string, age: string, gender: string, chiefComplaint: string, priority: Priority, assignedTeam: string) {
    this.location = location;
    this.source = source;
    this.age = age;
    this.gender = gender;
    this.chiefComplaint = chiefComplaint;
    this.priority = priority;
    this.assignedTeam = assignedTeam;
  }

  static empty() {
    return new QuickCall('', '', '', '', '', Priority.empty(), '');
  }

}

export class QuickClinicCall {
  age: string;
  gender: string;
  chiefComplaint: string;
  priority: Priority;

  constructor(age: string, gender: string, chiefComplaint: string, priority: Priority) {
    this.age = age;
    this.gender = gender;
    this.chiefComplaint = chiefComplaint;
    this.priority = priority;
  }

  static empty() {
    return new QuickClinicCall('', '', '', Priority.empty());
  }
}

export interface Call extends _Call {
  id: string;
  order: number;
  status: string;
  assignedTeams: string[];
  duplicate?: boolean;
  duplicateOf?: string;
  log?: CallLogEntry[];
  notes?: string;
  detachedTeams?: DetachedTeam[];
  equipmentTeams?: string[];
  equipment?: string[];
  clinic?: boolean;
  outcome?: ClinicOutcome;
}

export class LogEntry {
  timestamp: number;
  message: string;

  constructor(message: string = '') {
    const now = new Date();
    const hhmm = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');

    this.timestamp = now.getTime()
    this.message = message.match(/^\d{4}\s*-\s*[^\s]*$/) ? message : `${hhmm} - ${message}`
  }

  toString(): string {
    return this.message
  }
}

export class CallLogEntry extends LogEntry {

  constructor(message: string = '') {
    super(message)
  }

}

export type EquipmentStatus = string;

export interface Equipment {
  id: string;
  name: string;
  status: EquipmentStatus;
  assignedTeam?: string | null;
  location?: string;
}

export class EventEquipment implements Equipment {
  id: string;
  name: string;
  status: EquipmentStatus;
  assignedTeam?: string | null;
  location?: string;
  locationId?: string;
  defaultLocation?: string;
  notes?: string

  constructor(name: string, status: EquipmentStatus, assignedTeam?: string | null, location?: string, locationId?: string, defaultLocation?: string, notes?: string) {
    this.id = `eq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    this.name = name
    this.status = status
    this.assignedTeam = assignedTeam
    this.location = location
    this.locationId = locationId
    this.defaultLocation = defaultLocation
    this.notes = notes
  }

}
// Equipment & { locationId?: string; defaultLocation?: string; notes?: string };

export interface Area {
  id: string;
  shape: "circle" | "rect" | "poly";
  coords: number[];
  preFillColor: string;
  fillColor: string;
  strokeColor: string;
  lineWidth: number;
  active: boolean;
  disabled: boolean;
}

export interface ImgMap {
  name: string;
  areas: Area[];
}

export interface MouseClickLog {
  timestamp: number;
}

export interface KeyStrokeLog {
  timestamp: number;
}

export interface InteractionSession {
  sessionId: string;
  eventId: string;
  startTime: number;
  endTime?: number;
  mouseClicks: MouseClickLog[];
  keyStrokes: KeyStrokeLog[];
}

export type EquipmentItem = {
  name: string;
  stagingLocation: string; // Default/designated staging location
  currentLocation?: string; // Current location override
  status: string; // 'Available' or 'Call X'
  callId?: string; // Associated call ID if on a call
  deliveryTeam?: string; // Team delivering the equipment
  needsRefresh?: boolean; // Whether equipment needs to be marked ready after clinic delivery
  notes?: string; // Additional details/notes about the equipment
};

export class Role {
  name: string;
  fullName: string;

  constructor(name: string, fullName: string) {
    this.name = name;
    this.fullName = fullName;
  }

  static empty() {
    return new Role('', '');
  }
}

export class Priority {
  id: number;
  name: string;
  color: string;

  constructor(id: string | number, name: string | undefined, color: string | undefined) {
    this.id = Number(id);
    this.name = name ?? "";
    this.color = color ?? "";
  }

  static empty() {
    return new Priority(-1, "", "");
  }

  shortName(): string {
    return `P${this.id}`
  }

  toString(): string {
    return `P${this.id} - ${this.name}`;
  }

  valid(): boolean {
    return this.id >= 0;
  }

  static create({ id, name, color }: { id: string | number; name: string | undefined, color: string | undefined }): Priority {
    return new Priority(id, name, color);
  }

  critical(): boolean {
    return this.id === 0;
  }
}

export type QuickCallState = {
  priority: Priority;
  location: string;
  source: string;
  age: string;
  gender: string;
  chiefComplaint: string;
  assignedTeam: string;
};