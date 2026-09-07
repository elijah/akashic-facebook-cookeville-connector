export interface CivicEntity {
  id: string;
  source: string;
  timestamp: string;
  reliability: number;
  title: string;
  date: string;
  content: string;
  outcomes: any[];
  voteResult: string;
  type: string;
  engagementScore: number;
  numComments: number;
}

export interface FacebookData {
  posts: FacebookPost[];
}

export interface FacebookPost {
  id: string;
  source: string;
  timestamp: string;
  reliability: number;
  title: string;
  date: string;
  content: string;
  engagementScore?: number;
  comments?: FacebookComment[];
}

export interface FacebookComment {
  id: string;
  source: string;
  timestamp: string;
  reliability: number;
  content: string;
  author: string;
  created_time: string;
  engagementScore?: number;
}