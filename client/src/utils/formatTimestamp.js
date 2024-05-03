// Funktion til at formatere en tidsstempel til en dato i en bestemt formatering
export function formatTimestampToDate(timestampString) {
  try {
    // Konverterer tidsstempelstrengen til en datoobjekt
    const timestamp = new Date(timestampString);

    // Opsætning af formateringsindstillinger for datoen
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    // Konverterer tidsstempel til en formateret datostring
    const formattedTime = timestamp.toLocaleDateString("en-US", options);

    // Konverterer AM/PM til små bogstaver og returnerer den formaterede datostring
    return formattedTime.replace(/ (AM|PM)$/, (match) => match.toLowerCase());
  } catch (error) {
    // Håndtering af fejl, hvis tidsstempelstrengen er ugyldig
    console.error(
      "Invalid timestamp format. Please provide a valid ISO 8601 string."
    );
    return null; // Returnerer null i tilfælde af fejl
  }
}

// Funktion til at formatere en tidsstempel til et 'for n tid siden' format
export function formatTimestampToTimeAgo(timestampString) {
  try {
    // Konverterer tidsstempelstrengen til et datoobjekt
    const timestamp = new Date(timestampString);
    const now = new Date(); // Dagens dato og tid

    // Beregning af forskellen mellem nu og tidsstempel
    const difference = now - timestamp;

    // Definition af tidsenheder og deres værdier i millisekunder
    const timeUnits = [
      { unit: "year", value: 31536000000 }, // Antal millisekunder på et år
      { unit: "month", value: 2592000000 }, // Antal millisekunder på en måned
      { unit: "day", value: 86400000 }, // Antal millisekunder på en dag
      { unit: "hour", value: 3600000 }, // Antal millisekunder på en time
      { unit: "minute", value: 60000 }, // Antal millisekunder på et minut
      { unit: "second", value: 1000 }, // Antal millisekunder på et sekund
    ];

    // Gennemgår tidsenhederne og finder den største passende enhed
    for (const unit of timeUnits) {
      const unitDifference = Math.floor(difference / unit.value);
      if (unitDifference > 0) {
        // Returnerer formateret streng baseret på den største passende enhed
        return `${unitDifference} ${unit.unit}${
          unitDifference > 1 ? "s" : ""
        } ago`;
      }
    }

    // Returnerer "Lige nu", hvis forskellen er mindre end et sekund
    return "Just now";
  } catch (error) {
    // Håndtering af fejl, hvis tidsstempelstrengen er ugyldig
    console.error(
      "Invalid timestamp format. Please provide a valid ISO 8601 string."
    );
    return null; // Returnerer null i tilfælde af fejl
  }
}
