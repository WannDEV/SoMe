import { useState } from "react"; // Import af useState hook fra React
import ProfilePicture from "../../ProfilePicture/ProfilePicture"; // Import af profilbilledekomponenten
import styles from "./PostCard.module.css"; // Import af CSS-moduler til styling
import { AiOutlineLike, AiFillLike } from "react-icons/ai"; // Import af ikoner fra React-icons-pakken
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa"; // Import af ikoner fra React-icons-pakken
import { CiShare2 } from "react-icons/ci"; // Import af ikoner fra React-icons-pakken
import { formatTimestampToDate } from "../../../utils/formatTimestamp"; // Import af funktion til formatering af tidsstempel
import CommentSection from "../CommentSection/CommentSection"; // Import af komponent til kommentarsektionen
import api from "../../../utils/api"; // Import af API-funktionalitet
import Image from "next/image"; // Import af billedkomponent fra Next.js
import MenuBar from "../../MenuBar/MenuBar"; // Import af menulinjekomponent
import { IoIosMore } from "react-icons/io"; // Import af ikoner fra React-icons-pakken
import { MdDelete } from "react-icons/md"; // Import af ikoner fra React-icons-pakken
import { usePosts } from "../../../contexts/PostsContext"; // Import af kontekst til håndtering af opslag
import { useAuth } from "@/contexts/AuthContext"; // Import af brugerautentificeringskontekst

const PostCard = (props) => {
  // Props destruktureres for at få adgang til postobjektet
  const post = props.post;

  // Tilstande til opslagets funktioner og visninger
  const [liked, setLiked] = useState(post.has_liked);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isOpen, setIsOpen] = useState(false);

  // Brugeroplysninger og fjernelse af opslag fra kontekster
  const { removePost } = usePosts();
  const { user } = useAuth();

  // Funktion til at håndtere "Synes godt om" handling
  const handleLike = () => {
    if (!liked == true) {
      api
        .post(`post-interaction/${post.post_id}/like`)
        .then((response) => {
          console.log("Like added:", response.data);
          post.likes_count++;
          setLiked(!liked);
        })
        .catch((error) => {
          console.error("Error adding like:", error);
        });
    } else {
      api
        .delete(`post-interaction/${post.post_id}/like`)
        .then((response) => {
          console.log("Like removed:", response.data);
          post.likes_count--;
          setLiked(!liked);
        })
        .catch((error) => {
          console.error("Error removing like:", error);
        });
    }
  };

  // Funktion til at håndtere visning/skjul af kommentarsektion
  const handleComment = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={styles.container}>
      {/* Profiloplysninger */}
      <div className={styles.profile}>
        <ProfilePicture
          src={post.profile_picture}
          style={{ marginRight: "0.5rem" }}
          userId={post.user_id}
        />
        <div>
          <h4>{post.username}</h4>
          <p>{formatTimestampToDate(post.post_date)}</p>
        </div>
        {/* Dropdown-menu til posthåndtering (slet post) */}
        <div className={styles.dropDownMenu}>
          {post.user_id === user.userId && (
            <MenuBar
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              triggerComponent={
                <button className={styles.dropDownMenuButton}>
                  <IoIosMore size={24} />
                </button>
              }
            >
              <ul>
                <li
                  onClick={() => removePost(post.post_id)}
                  className={styles.deletePost}
                >
                  <MdDelete size={24} />
                  Delete Post
                </li>
              </ul>
            </MenuBar>
          )}
        </div>
      </div>
      {/* Indhold af opslag */}
      <div className={styles.content}>
        {/* Tekstindhold af opslag med "Vis mere" funktionalitet */}
        {post.content && (
          <p>
            {post.content.length <= 300 || showMore === true
              ? post.content
              : `${post.content.substring(0, 300)}... `}
            {post.content.length > 300 && !showMore && (
              <span
                onClick={() => setShowMore(true)}
                className={styles.showMore}
              >
                Show more
              </span>
            )}
          </p>
        )}
        {/* Billedeindhold af opslag */}
        <div className={styles.imageContainer}>
          {post.img && (
            <Image
              src={post.img}
              alt="Post"
              width={500}
              height={300}
              layout="responsive"
            />
          )}
        </div>
      </div>
      <hr />
      {/* Knapper til handlinger som "Synes godt om", kommentarer og deling */}
      <div className={styles.actionButtons}>
        <span style={{ display: "flex" }}>
          <button
            onClick={handleLike}
            className={`${liked ? styles.isLiked : ""}`}
          >
            {liked ? <AiFillLike size={24} /> : <AiOutlineLike size={24} />}{" "}
            <p>{post.likes_count}</p>
          </button>
          <button
            onClick={handleComment}
            className={`${showComments ? styles.isCommentSectionActive : ""}`}
          >
            {showComments ? (
              <FaCommentDots size={24} />
            ) : (
              <FaRegCommentDots size={24} />
            )}
            <p>{commentsCount}</p>
          </button>
        </span>
        <button>
          <CiShare2 size={24} /> <p>{post.shares_count}</p>
        </button>
      </div>
      <hr />
      {/* Kommentarsektion */}
      <CommentSection
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        commentsCount={commentsCount}
        setCommentsCount={setCommentsCount}
      />
    </div>
  );
};

export default PostCard;
