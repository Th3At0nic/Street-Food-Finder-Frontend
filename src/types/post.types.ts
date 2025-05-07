import { User } from "./user.types";

export enum PostType {
  NORMAL = "NORMAL",
  PREMIUM = "PREMIUM"
}

export enum PostStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE"
}

export type Post = {
  pId: string;
  categoryId: string;
  authorId: string;
  pType: PostType;
  status: PostStatus;
  title: string;
  description: string;
  priceRangeStart: number;
  priceRangeEnd: number;
  location: string;
  approvedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: PostCategory;
  author?: User;
  votes?: Vote[];
  comments?: Comment[];
  postRatings?: PostRating[];
  postImages?: PostImage[];

  // Computed properties
  totalVotes?: number;
  averageRating?: number;
};

export type PostCategory = {
  catId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Vote = {
  vId: string;
  postId: string;
  voterId: string;
  vType: VoteType;
  createdAt: Date;
  updatedAt: Date;
  voter?: User;
};

export type Comment = {
  cId: string;
  postId: string;
  commenterId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  commenter?: User;
};

export type PostRating = {
  prId: string;
  postId: string;
  ratedBy: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostImage = {
  imId: string;
  postId: string;
  file_path: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PostsResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: Post[];
  };
}

export interface CategoryResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: PostCategory[];
  };
}
