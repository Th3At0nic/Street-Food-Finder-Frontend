import { PostImage, PostRating } from "./post.types";

export interface ITrendingPostResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Datum[];
}

export interface Datum {
  pId: string;
  categoryId: string;
  authorId: string;
  pType: string;
  status: string;
  title: string;
  description: string;
  priceRangeStart: string;
  priceRangeEnd: string;
  location: string;
  rejectReason: null;
  approvedBy: null;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  postImages: PostImage[];
  author: Author;
  postRatings: PostRating[];
  _count: Count;
  averageRating: number;
}

export interface Count {
  comments: number;
  votes: number;
  postRatings: number;
}

export interface Author {
  id: string;
  role: string;
  status: string;
  userDetails: UserDetails;
}

export interface UserDetails {
  name: string;
  profilePhoto: null | string;
}

export interface Category {
  catId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
