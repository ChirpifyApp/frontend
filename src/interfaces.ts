interface IPost {
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

interface ID {
	id: number;
}

interface IUser {
	name: string | null;
	email: string;
}
