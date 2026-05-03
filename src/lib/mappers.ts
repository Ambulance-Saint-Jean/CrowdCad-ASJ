import { Priority, Role } from "@/app/types";
import { DocumentData } from "firebase/firestore";

export function roleMapper(data: DocumentData): Role[] {
    return Object.entries(data).map(([, v]) => new Role(v.name, v.fullName));
}

export function priorityMapper(data: DocumentData): Priority[] {
    return Object.entries(data).map(([k, v]) => new Priority(k, v.name, v.color[k]));
}