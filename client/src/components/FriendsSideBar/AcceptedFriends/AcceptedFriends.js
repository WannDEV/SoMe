import styles from "./AcceptedFriends.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";

const DUMMY_ACCEPTED_FRIENDS = [
  {
    id: 1,
    username: "JohnDoe",
    profile_picture: "/default.jpg",
  },
  {
    id: 2,
    username: "JaneDoe",
    profile_picture: "/default.jpg",
  },
  {
    id: 3,
    username: "JohnSmith",
    profile_picture: "/default.jpg",
  },
  {
    id: 4,
    username: "drfdrghdrth",
    profile_picture: "/default.jpg",
  },
  {
    id: 5,
    username: "serfsefsef",
    profile_picture: "/default.jpg",
  },
  {
    id: 6,
    username: "rhtrthrht",
    profile_picture: "/default.jpg",
  },
];

const AcceptedFriends = (props) => {
  const acceptedFriends = props.acceptedFriends;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friends</h2>
      <ul className={styles.friendsList}>
        {DUMMY_ACCEPTED_FRIENDS.map((friend) => (
          <li key={friend.id} className={styles.friendsItem}>
            <ProfilePicture
              src={friend.profile_picture}
              alt={friend.username}
            />
            <span>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcceptedFriends;
