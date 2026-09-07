import { CivicEntity } from './types';
import { FacebookData } from './types';

// Updated mapper to handle the new data structure with comments at post level
export function mapFacebookToSchema(data: FacebookData): CivicEntity[] {
  const entities: CivicEntity[] = [];

  // Process each post
  data.posts.forEach(post => {
    // Create entity for the post
    const postEntity: CivicEntity = {
      id: post.id,
      source: post.source,
      timestamp: post.timestamp,
      reliability: post.reliability,
      title: post.title,
      date: post.date,
      content: post.content,
      outcomes: [],
      voteResult: "not_present",
      type: 'post',
      engagementScore: post.engagementScore || 0,
      numComments: post.comments?.length || 0
    };
    entities.push(postEntity);

    // Create entities for each comment
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(comment => {
        const commentEntity: CivicEntity = {
          id: comment.id,
          source: comment.source,
          timestamp: comment.timestamp,
          reliability: comment.reliability,
          title: `Comment on Post: ${post.id}`,
          date: comment.created_time,
          content: comment.content,
          outcomes: [],
          voteResult: "not_present",
          type: 'comment',
          engagementScore: comment.engagementScore || 0,
          numComments: 0
        };
        entities.push(commentEntity);
      });
    }
  });

  return entities;
}