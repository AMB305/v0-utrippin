import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Camera, 
  Send,
  MoreHorizontal,
  Bookmark,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface TravelStory {
  id: string;
  title: string;
  content: string;
  image_url: string;
  location: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  user_email: string;
  is_liked?: boolean;
}

interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  user_email: string;
}

export function TravelStoriesFeed() {
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStory, setNewStory] = useState({ title: "", content: "", location: "" });
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: StoryComment[] }>({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('travel_stories')
        .select(`
          *
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get user emails separately
      if (storiesData && storiesData.length > 0) {
        const userIds = [...new Set(storiesData.map(story => story.user_id))];
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email')
          .in('id', userIds);

        const usersMap = new Map(usersData?.map(user => [user.id, user.email]) || []);

        const storiesWithUsers = storiesData.map(story => ({
          ...story,
          user_email: usersMap.get(story.user_id) || 'Anonymous'
        }));

        // Check which stories current user has liked
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const storyIds = storiesWithUsers.map(story => story.id);
          const { data: likesData } = await supabase
            .from('story_likes')
            .select('story_id')
            .eq('user_id', user.id)
            .in('story_id', storyIds);

          const likedStoryIds = new Set(likesData?.map(like => like.story_id) || []);
          
          const storiesWithLikes = storiesWithUsers.map(story => ({
            ...story,
            is_liked: likedStoryIds.has(story.id)
          }));

          setStories(storiesWithLikes);
        } else {
          setStories(storiesWithUsers);
        }
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load travel stories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to like stories');
      return;
    }

    try {
      const story = stories.find(s => s.id === storyId);
      if (!story) return;

      if (story.is_liked) {
        // Unlike
        await supabase
          .from('story_likes')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);
        
        setStories(prev => prev.map(s => 
          s.id === storyId 
            ? { ...s, is_liked: false, likes_count: s.likes_count - 1 }
            : s
        ));
      } else {
        // Like
        await supabase
          .from('story_likes')
          .insert({ story_id: storyId, user_id: user.id });
        
        setStories(prev => prev.map(s => 
          s.id === storyId 
            ? { ...s, is_liked: true, likes_count: s.likes_count + 1 }
            : s
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const fetchComments = async (storyId: string) => {
    try {
      const { data: commentsData, error } = await supabase
        .from('story_comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (commentsData && commentsData.length > 0) {
        // Get user emails for comments
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email')
          .in('id', userIds);

        const usersMap = new Map(usersData?.map(user => [user.id, user.email]) || []);

        const commentsWithUser = commentsData.map(comment => ({
          ...comment,
          user_email: usersMap.get(comment.user_id) || 'Anonymous'
        }));

        setComments(prev => ({ ...prev, [storyId]: commentsWithUser }));
      } else {
        setComments(prev => ({ ...prev, [storyId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async (storyId: string) => {
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    try {
      const { error } = await supabase
        .from('story_comments')
        .insert({
          story_id: storyId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment("");
      fetchComments(storyId);
      
      // Update comments count
      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, comments_count: s.comments_count + 1 }
          : s
      ));

      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async (story: TravelStory) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.content,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const toggleComments = async (storyId: string) => {
    if (showComments === storyId) {
      setShowComments(null);
    } else {
      setShowComments(storyId);
      if (!comments[storyId]) {
        await fetchComments(storyId);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
              <div className="h-48 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Story Card */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Share Your Travel Story</h3>
              <p className="text-sm text-muted-foreground">Inspire others with your adventures</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => toast.info('Create story feature coming soon!')}>
            <Camera className="h-4 w-4 mr-2" />
            Create Story
          </Button>
        </CardContent>
      </Card>

      {/* Stories Feed */}
      {stories.map((story) => (
        <Card key={story.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user_email}`} />
                  <AvatarFallback>{story.user_email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{story.user_email.split('@')[0]}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {story.location && (
                      <>
                        <MapPin className="h-3 w-3" />
                        <span>{story.location}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-3">
            <h3 className="font-bold text-lg mb-2">{story.title}</h3>
            {story.content && (
              <p className="text-muted-foreground mb-4">{story.content}</p>
            )}
            
            {story.image_url && (
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img 
                  src={story.image_url} 
                  alt={story.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(story.id)}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${story.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {story.likes_count}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(story.id)}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {story.comments_count}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(story)}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
              
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments Section */}
            {showComments === story.id && (
              <div className="mt-4 pt-4 border-t space-y-3">
                {comments[story.id]?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_email}`} />
                      <AvatarFallback>{comment.user_email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="font-semibold text-sm">{comment.user_email.split('@')[0]}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Add Comment */}
                <div className="flex gap-3 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[40px] max-h-[120px]"
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleComment(story.id)}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}