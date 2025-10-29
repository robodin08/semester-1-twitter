import { StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";

import { Text, View, Loader } from "@/components/Themed";
import { PostCard } from "@/components/PostCard";
import { useUser } from "@/hooks/useUser";
import { Post, PostActionType } from "@/contexts/UserContext";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function Profile() {
  const { user, getPosts } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [inAction, setInAction] = useState(false);

  async function onAction(postId: number, action: PostActionType) {
    if (inAction) return;
    setInAction(true);

    const post = posts.find((p) => p.id === postId);
    if (!post) {
      setInAction(false);
      return;
    }

    // api
    const newPost = { ...post };

    if (action === PostActionType.BOOST) {
      if (post.userAction === PostActionType.BOOST) {
        newPost.boostCount--;
        newPost.userAction = null;
      } else {
        newPost.boostCount++;
        newPost.userAction = PostActionType.BOOST;
      }
    } else if (action === PostActionType.DISLIKE) {
      if (post.userAction === PostActionType.DISLIKE) {
        newPost.userAction = null;
      } else {
        if (post.userAction === PostActionType.BOOST) newPost.boostCount--;
        newPost.userAction = PostActionType.DISLIKE;
      }
    }

    setPosts(posts.map((p) => (p.id === postId ? newPost : p)));

    setInAction(false);
  }

  async function loadPosts() {
    if (loading || !hasMore) return;
    setLoading(true);

    const newPosts = await getPosts(offset);
    await delay(500);

    if (typeof newPosts === "string") {
      console.error(newPosts);
      setLoading(false);
      return;
    }

    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
      setOffset((prev) => prev + 1);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  if (offset === 0 && loading) return <Loader />;

  return (
    <View style={styles.container} safe={true}>
      {posts.length === 0 && !loading ? (
        <Text style={styles.emptyText}>Something went wrong while fetching posts</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} onAction={onAction} />}
          onEndReached={loadPosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <Loader /> : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
