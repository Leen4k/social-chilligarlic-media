export interface PostProps {
    title: string;
    photos?: string[];
    id: string;
    createdAt: string
    user: {
        name: string;
        image: string;
    }
    comments: {
        createdAt: string
        id: string
        postId: string
    }
    hearts?: string[]
}