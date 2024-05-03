import AWS from "aws-sdk"; // Importerer AWS SDK for at kommunikere med AWS-tjenester
import multer from "multer"; // Importerer multer til håndtering af filupload
import multerS3 from "multer-s3"; // Importerer multer-s3 til upload til Amazon S3
import { config } from "dotenv"; // Importerer dotenv til indlæsning af miljøvariabler
import { v4 as uuidv4 } from "uuid"; // Importerer uuid til generering af unikke ID'er

config(); // Konfigurerer dotenv til at indlæse miljøvariabler fra .env-filen

// Opretter en S3-klient med adgangsparametre fra miljøvariabler
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Definerer tilladte filtyper til upload
const allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

// Eksporterer en multer middleware-instans til håndtering af filupload
export const upload = multer({
  storage: multerS3({
    // Bruger multer-s3 til at gemme filer direkte på Amazon S3
    s3: s3, // Angiver S3-klienten, der skal bruges
    bucket: process.env.AWS_BUCKET_NAME, // Angiver navnet på S3-bøtten fra miljøvariabler
    acl: "public-read", // Sætter adgangsniveauet til offentlig læsbar
    contentType: multerS3.AUTO_CONTENT_TYPE, // Sætter automatisk indholdstype baseret på filtypen
    key: function (req, file, cb) {
      // Definerer en nøglefunktionsfunktion til at generere unikke filnavne
      const extension = file.mimetype.split("/")[1]; // Henter filtypen fra MIME-typen
      cb(null, `images/${uuidv4()}.${extension}`); // Sætter filnavnet til "images/UNIK_ID.filtype"
    },
  }),
  fileFilter: (req, file, cb) => {
    // Definerer en filfiltret funktion til kun at tillade visse filtyper
    const isAllowed = allowedFileTypes.includes(file.mimetype); // Kontrollerer om filtypen er tilladt
    if (!isAllowed) {
      // Hvis filtypen ikke er tilladt
      return cb(new Error("Ikke-understøttet filtype")); // Kald tilbage med en fejlbesked
    }
    cb(null, isAllowed); // Kald tilbage uden fejl for at tillade upload
  },
});
