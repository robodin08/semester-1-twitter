import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, Spacer, type ViewProps } from "@/components/Themed";
import { Post, PostActionType } from "@/contexts/UserContext";
import { timeAgo } from "@/utils/timeAgo";

interface PostCardProps extends ViewProps {
  post: Post;
  onAction: (postId: number, action: PostActionType) => void;
}

export function PostCard({ post, onAction }: PostCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{post.message}</Text>

      <View style={styles.meta}>
        <Text style={styles.date}>{timeAgo(post.createdAt)}</Text>
      </View>

      <Spacer height={10} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onAction(post.id, PostActionType.BOOST)}
        >
          <Ionicons
            name={post.userAction === PostActionType.BOOST ? "flash" : "flash-outline"}
            size={20}
            color={post.userAction === PostActionType.BOOST ? "#e74c3c" : "#777"}
          />
          <Text style={styles.statsText}>{post.boostCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onAction(post.id, PostActionType.DISLIKE)}
        >
          <Ionicons
            name={
              post.userAction === PostActionType.DISLIKE ? "thumbs-down" : "thumbs-down-outline"
            }
            size={20}
            color={post.userAction === PostActionType.DISLIKE ? "#555" : "#777"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: "#222",
  },
  meta: {
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 12,
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statsText: {
    fontSize: 14,
    color: "#333",
  },
});
