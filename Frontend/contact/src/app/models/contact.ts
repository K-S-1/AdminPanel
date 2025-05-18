export interface Contact {
	id: number;
	name: string;
	dob: string;
	userName: string;
	password?: string;
	gender: string;
	address: string;
	profileImage?: string; // Assuming base64 or URL
	profileContentType?: string; // MIME type of image
	contactNumber: string;
	pinCode?: number;
	accessRole?: string;
	resetPasswordToken?: string;
	isActive?: boolean;
  }