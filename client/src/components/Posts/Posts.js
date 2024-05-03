// Importér CSS-moduler, komponenter og ikoner samt hooks og skeletkomponenten
import styles from "./Posts.module.css"; // CSS-stilark til komponenten
import PostCard from "./PostCard/PostCard"; // Komponent til visning af et enkelt opslag
import CreatePostCard from "./CreatePost/CreatePostCard"; // Komponent til oprettelse af et nyt opslag
import { AiOutlineInbox } from "react-icons/ai"; // Ikoner fra React-icons-biblioteket
import { usePosts } from "../../contexts/PostsContext"; // Brugerdefineret hook til at få adgang til opslagskonteksten
import Skeleton from "react-loading-skeleton"; // Komponent til at vise en midlertidig skeletlayout under indlæsning
import "react-loading-skeleton/dist/skeleton.css"; // CSS-stil til skeletkomponenten

// Definér Posts-komponenten
const Posts = (props) => {
  const { posts, loading } = usePosts(); // Brug hooket til at få adgang til opslagstilstanden

  return (
    // Samlet container til opslagssektionen
    <div className={styles.container}>
      {/* Vis CreatePostCard-komponenten, medmindre hideCreatePost-prop er sand */}
      <CreatePostCard hide={props.hideCreatePost} />

      {/* Vis en besked, hvis der ikke er nogen opslag, og indlæsning er afsluttet */}
      {!loading && posts.length === 0 && (
        <div className={styles.noPosts}>
          <AiOutlineInbox size={100} /> {/* Vis en ikon til tom indbakke */}
          <h2>No posts to show</h2>{" "}
          {/* Vis en meddelelse om, at der ikke er nogen opslag */}
        </div>
      )}

      {/* Gennemgå alle opslag og vis hver enkelt som en PostCard-komponent */}
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}

      {/* Vis skeletlayout, mens opslag indlæses */}
      {loading && (
        <Skeleton count={3} height={200} className={styles.postSkeleton} />
      )}
    </div>
  );
};

export default Posts; // Eksporter Posts-komponenten som standard
