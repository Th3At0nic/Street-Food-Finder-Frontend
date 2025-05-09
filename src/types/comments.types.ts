export enum CommentStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED"
}

export interface IComment {
  cId: string;
  postId: string;
  commenterId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  commenter: ICommenter;
  post: ICommentPost;
}

export interface ICommenter {
  id: string;
  role: string;
  status: string;
  userDetails: ICommentUserDetails;
}

export interface ICommentUserDetails {
  name: string;
  profilePhoto: string;
}

export interface ICommentPost {
  pId: string;
  title: string;
  description: string;
}
