"use client";
import { WithAuth } from "../../../components/Auth/WithAuth";
import { useParams } from 'next/navigation'
import styles from './page.module.css';
import ProfilePicture from '../../../components/ProfilePicture/ProfilePicture';
import api from "../../../utils/api";
import { useEffect, useState } from "react";
import { ImSad } from "react-icons/im";

const Profile = () => {
  const params = useParams();
  const { userId } = params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`user-profile/${userId}`).then((response) => {
      setUser(response.data.user);
      console.log(response.data.user);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
  } , [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <div className={styles.notFound}>
      <ImSad size={48} />
      <h1>User not found</h1>
    </div>;
  }

  return (
    <main className={styles.container}>
      <div>
     <div className={styles.profileInformation}>
      <ProfilePicture src={user.profilePicture} />
      <div>
        <h1>Username: {user.username}</h1>
        <p>registration_date: {user.registrationDate}</p>
     </div>
    </div>
    </div>
    </main>
  );
}

export default WithAuth(Profile);