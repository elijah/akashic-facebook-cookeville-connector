import { mapFacebookToSchema } from './mapper';
import { mockFacebookData } from './mock-data';

describe('Facebook Connector Validation', () => {
  test('maps Facebook posts and comments to CivicEntity objects correctly', () => {
    const entities = mapFacebookToSchema(mockFacebookData);
    
    // Find the main post entity
    const postEntity = entities.find(e => e.type === 'post' && e.id === 'post_123');
    expect(postEntity).toBeDefined();
    expect(postEntity.title).toContain('Community Garden Project Update');
    expect(postEntity.type).toBe('post');
    expect(postEntity.engagementScore).toBeGreaterThan(0);
    expect(postEntity.numComments).toBeGreaterThan(0);
    expect(postEntity.source).toBe('facebook-cookeville');
    
    // Find the first comment entity
    const commentEntity = entities.find(e => e.type === 'comment' && e.id === 'comment_456');
    expect(commentEntity).toBeDefined();
    expect(commentEntity.content).toContain('Great work');
    expect(commentEntity.type).toBe('comment');
    expect(commentEntity.title).toContain('Comment on Post: post_123');
  });

  test('maintains proper CivicEntity structure with all new fields', () => {
    const entities = mapFacebookToSchema(mockFacebookData);
    
    entities.forEach(entity => {
      expect(entity).toHaveProperty('id');
      expect(entity).toHaveProperty('source');
      expect(entity).toHaveProperty('timestamp');
      expect(entity).toHaveProperty('type');
      expect(entity).toHaveProperty('engagementScore');
      expect(entity).toHaveProperty('numComments');
      expect(entity).toHaveProperty('voteResult');
    });
  });

  test('creates distinct entities for posts and comments', () => {
    const entities = mapFacebookToSchema(mockFacebookData);
    
    const postCount = entities.filter(e => e.type === 'post').length;
    const commentCount = entities.filter(e => e.type === 'comment').length;
    
    expect(postCount).toBe(1);
    expect(commentCount).toBe(2);
    expect(postCount + commentCount).toBe(entities.length);
  });
});