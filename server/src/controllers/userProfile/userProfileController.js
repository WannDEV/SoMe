// Importerer 'pool' fra db/index.js, som er en databaseforbindelse
import pool from "../../db/index.js";
// Importerer 'upload' funktionen fra s3-aws.js, som sandsynligvis bruges til at uploade billeder til AWS S3
import { upload } from "../../utils/s3-aws.js";

// Funktion til at tjekke, om en værdi er et heltal
function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

// Funktion til at hente brugerens profiloplysninger
export const getUserProfile = async (req, res) => {
  try {
    // Henter brugerens id fra URL-parametrene eller fra anmodningen, hvis det ikke er angivet i URL'en
    const userId = !req.params.userId ? req.userId : req.params.userId;

    // Kontrollerer, om brugerens id er et heltal
    if (!isInt(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // SQL-query til at hente brugerens profiloplysninger baseret på brugerens id
    const query =
      "SELECT username, email, profile_picture, registration_date FROM app_user WHERE user_id = $1";
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, [userId]);
    // Hvis der ikke findes nogen bruger med det givne id, returneres status 404 (ikke fundet)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Henter brugerens oplysninger fra resultatet
    const user = result.rows[0];

    // Sender status 200 (OK) og returnerer brugerens profiloplysninger som JSON
    res.status(200).json({
      user: {
        userId,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationDate: user.registration_date,
      },
    });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at opdatere brugerens profiloplysninger
export const updateUserProfile = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter brugernavn og email fra anmodningens krop
    const { username, email } = req.body;
    // SQL-query til at opdatere brugerens profiloplysninger i databasen
    const query =
      "UPDATE app_user SET username = $1, email = $2 WHERE user_id = $4 RETURNING *";
    const values = [username, email, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Hvis der ikke findes nogen bruger med det givne id, returneres status 404 (ikke fundet)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Henter brugerens oplysninger fra resultatet
    const user = result.rows[0];

    // Sender status 200 (OK) og returnerer brugerens opdaterede profiloplysninger som JSON
    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        registrationDate: user.registration_date,
      },
    });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at opdatere brugerens profilbillede
export const updateUserProfilePicture = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;

    // Udfører upload af billede ved hjælp af 'upload' funktionen fra s3-aws.js
    await upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Henter URL'en til det uploaded billede
      const profilePicture = req.file.location;
      // SQL-query til at opdatere brugerens profilbillede i databasen
      const query =
        "UPDATE app_user SET profile_picture = $1 WHERE user_id = $2 RETURNING *";
      const result = await pool.query(query, [profilePicture, userId]);
      // Hvis der ikke findes nogen bruger med det givne id, returneres status 404 (ikke fundet)
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      // Henter brugerens oplysninger fra resultatet
      const user = result.rows[0];

      // Sender status 200 (OK) og returnerer brugerens opdaterede profiloplysninger inklusive profilbillede som JSON
      res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
          profilePicture: user.profile_picture,
          registrationDate: user.registration_date,
        },
      });
    });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at slette brugerprofilen
export const deleteUserProfile = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;

    // SQL-query til at slette brugerprofilen fra databasen
    const deleteUserQuery =
      "DELETE FROM app_user WHERE user_id = $1 RETURNING *";
    const deleteUserResult = await pool.query(deleteUserQuery, [userId]);
    // Hvis der ikke findes nogen bruger med det givne id, returneres status 404 (ikke fundet)
    if (deleteUserResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sender status 200 (OK) og en succesmeddelelse som JSON
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};
