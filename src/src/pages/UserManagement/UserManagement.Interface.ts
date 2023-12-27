export interface ModalProps {
  show?: boolean;
  title?: string;
  noteOne?: any;
  noteTwo?: any;
  modalType?: "default" | "notification" | "success" | "error" | "warning";
}

export interface UserRoles {
  roles: { [key: string]: UserRole[] };
}

export interface UserRole {
  label: string;
  sublabel?: {
    label: string;
    value: string[];
  };
  value: string[];
}

export interface UserRolesHeader {
  key: string;
  name: string;
  description: React.ReactNode;
}
