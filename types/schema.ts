export interface User {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  imageUri: string;
}

export interface UserListItem {
  user?: User;
  header_name?: string;
  is_header: boolean;
}

export interface Friends {
  sent: string[];
  received: string[];
  accepted: string[];
  blocked: string[];
}
