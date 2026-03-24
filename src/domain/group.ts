import { IStudent } from "./student";

export interface GroupMember {
  id: number;
  group_id: number;
  student: IStudent;
}

export interface Group {
  id: number;
  name: string;
  assignment_id: number;
  members: GroupMember[];
}

export interface CreateGroupRequest {
  name: string;
  assignment_id: number;
  member_ids: number[];
}

export interface UpdateGroupRequest {
  name?: string;
  new_member_ids?: number[];
  remove_member_ids?: number[];
}
