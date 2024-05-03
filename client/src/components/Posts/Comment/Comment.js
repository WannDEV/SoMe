import styles from "./Comment.module.css"; // Importér CSS-stilarter fra den lokale fil "Comment.module.css"
import ProfilePicture from "../../ProfilePicture/ProfilePicture"; // Importér ProfilePicture-komponenten til at vise profilbilledet for kommentaren
import { formatTimestampToTimeAgo } from "../../../utils/formatTimestamp"; // Importér en hjælpefunktion til at formatere tidsstempel til 'tid siden'-format
import { IoIosMore } from "react-icons/io"; // Importér 'mere'-ikonet fra react-icons/io
import MenuBar from "../../MenuBar/MenuBar"; // Importér MenuBar-komponenten til at vise en dropdown-menu
import { useState } from "react"; // Importér useState-hook fra React til at håndtere tilstand
import { MdDelete } from "react-icons/md"; // Importér slet-ikonet fra react-icons/md
import api from "../../../utils/api"; // Importér API-funktionalitet til at slette kommentaren
import { useAuth } from "@/contexts/AuthContext"; // Importér useAuth-hook fra AuthContext for at få adgang til brugeroplysninger

// Kommentar-komponenten
const Comment = (props) => {
  const comment = props.comment; // Kommentaren
  const [isOpen, setIsOpen] = useState(false); // Tilstand til at styre åbning/lukning af dropdown-menuen
  const { user } = useAuth(); // Brugeroplysninger fra useAuth-hook

  // Funktion til at slette kommentaren
  const handleDelete = () => {
    api
      .delete(`post-interaction/${props.postId}/comment/${comment.comment_id}`) // Anmodning om at slette kommentaren via API'en
      .then((response) => {
        console.log("Comment deleted"); // Logbesked om, at kommentaren er slettet
        setIsOpen(false); // Luk dropdown-menuen
        props.setComments(
          // Opdater kommentarlisten ved at fjerne den slettede kommentar
          props.comments.filter((c) => c.comment_id !== comment.comment_id)
        );
        props.setCommentsCount(props.commentsCount - 1); // Opdater antallet af kommentarer
      })
      .catch((error) => {
        console.error("Error deleting comment:", error); // Håndter fejl ved sletning af kommentaren
      });
  };

  return (
    <div className={styles.container}>
      {/* Profilbillede for den bruger, der har skrevet kommentaren */}
      <div className={styles.profile}>
        <ProfilePicture
          src={comment.profile_picture} // URL til brugerens profilbillede
          userId={comment.user_id} // Brugerens ID
        />
      </div>
      <div>
        <div className={styles.commentContainer}>
          <div className={styles.bubble}>
            <p className={styles.username}>{comment.username}</p>{" "}
            {/* Brugernavnet for den bruger, der har skrevet kommentaren */}
            <p className={styles.content}>{comment.content}</p>{" "}
            {/* Indholdet af kommentaren */}
          </div>
          {/* Dropdown-menu til yderligere handlinger */}
          {user.userId === comment.user_id && ( // Vis kun menuen, hvis den aktuelle bruger er den samme som forfatteren af kommentaren
            <MenuBar
              triggerComponent={
                // Udløserkomponenten, her en knap med 'mere'-ikonet
                <button
                  className={`${styles.moreButton} ${
                    isOpen ? styles.menuIsOpen : "" // Anvend særlig stil, hvis menuen er åben
                  }`}
                >
                  <IoIosMore size={18} /> {/* 'Mere'-ikon */}
                </button>
              }
              isOpen={isOpen} // Angiver om menuen er åben eller lukket
              setIsOpen={setIsOpen} // Funktion til at indstille om menuen er åben eller lukket
              placement="left" // Placering af menuen
            >
              {/* Indholdet af dropdown-menuen */}
              <ul>
                {/* Element til at slette kommentaren */}
                <li onClick={handleDelete} className={styles.deleteComment}>
                  <MdDelete size={24} /> {/* Slet-ikon */}
                  Delete comment {/* Tekst til at slette kommentaren */}
                </li>
              </ul>
            </MenuBar>
          )}
        </div>
        <p className={styles.date}>
          {formatTimestampToTimeAgo(comment.comment_date)}{" "}
          {/* Tidsstempel formateret til 'tid siden'-format */}
        </p>
      </div>
    </div>
  );
};

export default Comment; // Eksportér Comment-komponenten
