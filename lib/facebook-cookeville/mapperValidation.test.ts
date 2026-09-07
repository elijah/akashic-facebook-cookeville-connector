// lib/connectors/facebook-cookeville/validation.test.ts
import { mapFacebookToSchema, mapFacebookCommentToSchema } from './mapper';
import { mockFacebookData } from './mock-data';

describe('Facebook Connector Unit Tests', () => {
  test('maps Facebook posts to CivicEntity objects', () => {
    const entities = mapFacebookToSchema(mockFacebookData);
    expect(entities).toHaveLength(3);
    
    const governmentMeeting = entities.find(e => 
      e.title === 'Community Garden Project Update'
    );
    expect(governmentMeeting).toBeDefined();
    expect(governmentMeeting?.type).toBe('post');
    expect(governmentMeeting?.source).toBe('facebook');
    expect(governmentMeeting?.content.length).toBeGreaterThan(50);
  });

  test('maps Facebook comments to CivicEntity objects', () => {
    expect(mockFacebookData.comments.length).toBe(2);
    
    const commentEntity = mapFacebookCommentToSchema(
      mockFacebookData.comments[0], 
      'post_123'
    );
    
    expect(commentEntity).toMatchObject({
      id: expect.any(String),
      title: 'Comment on Post: post_123',
      content: mockFacebookData.comments[0].content,
      source: 'facebook',
      type: 'comment',
      parentPostId: 'post_123'
    });
  });

  test('creates proper CivicEntity structure for all elements', () => {
    const entities = mapFacebookToSchema(mockFacebookData);
    
    entities.forEach(entity => {
      // Validate required CivicEntity fields exist
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('source');
      expect(entity).toHaveProperty('timestamp');
      expect(entity).toHaveProperty('reliability');
      expect(entity).toHaveProperty('title');
      expect(entity).toHaveProperty('date');
      expect(entity).toHaveProperty('content');
    });
    
    // Validate different entity types
    const post = entities[0]; // Government meeting post
    const comment = entities.find(e => e.parentPostId); // Comment
    
    expect(post.type).toBeDefined();
    expect(comment?.type).toBeDefined();
    expect(comment?.parentPostId).toBeTruthy();
  });

  test('handles malformed data gracefully', () => {
    // Test with incomplete mock data
    const incompleteData = { ...mockFacebookData, posts: [] };
    const entities = mapFacebookToSchema(incompleteData);
    expect(entities).toHaveLength(0);
  });
});