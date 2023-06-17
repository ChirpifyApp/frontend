// eslint-disable-next-line no-unused-vars
export interface IPost {
	id: number;
	content: string;
	authorId: number;
	imageUrl: string | null;
	author: IUser;
	createdAt: string;
	updatedAt: string;
	likedBy: ID[];
	dislikedBy: ID[];
}

export interface ID {
	id: number;
}

export interface IUser {
	name: string | null;
	email: string;
}
