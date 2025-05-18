export interface AdminProfileUpdateRequest {
	name: string;
	dob: string;
	gender: string;
	address: string;
	contactNumber: string;
	pinCode?: number;
	userName: string;
	profileImage?: Blob; 
}