export interface User {
  id: string;
  full_name: string;
  username: string;
  phoneNumber: string;
}

export interface UserListItem {
  user?: User;
  header_name?: string;
  is_header: boolean;
}
