import { IMeta } from "./common.types";
import { TUser } from "./user.types";

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

export type TPost = {
  pId: string;
  categoryId: string;
  authorId: string;
  pType: PostType;
  status: PostStatus;
  title: string;
  description: string;
  rejectReason?: string;
  priceRangeStart: number;
  priceRangeEnd: number;
  location: string;
  approvedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: TPostCategory;
  author?: TUser;
  votes?: Vote[];
  comments?: Comment[];
  postRatings?: PostRating[];
  postImages?: PostImage[];
  _count: {
    comments: number;
    votes: number;
    postRatings: number;
  };

  // Computed properties
  totalVotes?: number;
  averageRating?: number;
};

export type TPostCategory = {
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
  voter?: TUser;
};

export type Comment = {
  cId: string;
  postId: string;
  commenterId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  commenter?: TUser;
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
    meta: IMeta;
    data: TPost[];
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
    data: TPostCategory[];
  };
}

export interface VoteCountResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    upVoteCount: number;
    downVoteCount: number;
  };
}

export interface VoteResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    vId: string;
    postId: string;
    voterId: string;
    vType: VoteType;
    createdAt: string;
    updatedAt: string;
  };
}
