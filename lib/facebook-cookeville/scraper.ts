// lib/connectors/facebook-cookeville/scraper.ts
import { public_fetch } from "@/lib/net/public_fetch";

// Facebook group ID for "Hip Cookeville" (e.g., 123456789012345)
const GROUP_ID = process.env.FACEBOOK_GROUP_ID || "YOUR_GROUP_ID";  // Replace with actual group ID

// Simple validation: filter out posts/comments that are too short or contain spammy patterns
const isValidContent = (text: string): boolean => {
  if (!text || text.trim().length < 10) return false; // Too short
  // Add more checks as needed (e.g., profanity, excessive caps, etc.)
  const spamPatterns = [
    /http[s]?:\/\/\S+/g, // Links (optional: might want to keep)
    /(?:click here|free money|limited time)/i, // Common spam phrases
  ];
  return !spamPatterns.some(pattern => pattern.test(text));
};

// Fetch all posts from the group feed with pagination
export const fetchGroupPosts = async (): Promise<any[]> => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || "YOUR_TOKEN";
  let allPosts: any[] = [];
  let nextUrl = `https://graph.facebook.com/v18.0/${GROUP_ID}/feed?fields=message,created_time,likes.summary.total_count,comments.summary(total_count).limit(0)&access_token=${accessToken}`;

  while (nextUrl) {
    const response = await public_fetch(nextUrl);
    if (!response.ok) throw new Error(`Failed to fetch group posts: ${response.statusText}`);

    const data = await response.json();
    allPosts = [...allPosts, ...data.data];

    // Check if there is a next page
    nextUrl = data.paging?.next || null;
  }

  return allPosts;
};

// Fetch all comments for a specific post with pagination
export const fetchGroupComments = async (postId: string): Promise<any[]> => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || "YOUR_TOKEN";
  let allComments: any[] = [];
  let nextUrl = `https://graph.facebook.com/v18.0/${postId}/comments?fields=message,from,created_time,likes.summary(true)&access_token=${accessToken}`;

  while (nextUrl) {
    const response = await public_fetch(nextUrl);
    if (!response.ok) throw new Error(`Failed to fetch comments for post ${postId}: ${response.statusText}`);

    const data = await response.json();
    allComments = [...allComments, ...data.data];

    nextUrl = data.paging?.next || null;
  }

  return allComments;
};

// Fetch replies for a specific comment (recursively)
export const fetchCommentReplies = async (commentId: string): Promise<any[]> => {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || "YOUR_TOKEN";
  let allReplies: any[] = [];
  let nextUrl = `https://graph.facebook.com/v18.0/${commentId}/comments?fields=message,from,created_time,likes.summary(true)&access_token=${accessToken}`;

  while (nextUrl) {
    const response = await public_fetch(nextUrl);
    if (!response.ok) throw new Error(`Failed to fetch replies for comment ${commentId}: ${response.statusText}`);

    const data = await response.json();
    allReplies = [...allReplies, ...data.data];

    nextUrl = data.paging?.next || null;
  }

  return allReplies;
};