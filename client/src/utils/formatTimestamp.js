export function formatTimestampToDate(timestampString) {
  // Try parsing the timestamp string
  try {
    const timestamp = new Date(timestampString);

    // Define the desired format options
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    // Format the date according to the options
    const formattedTime = timestamp.toLocaleDateString("en-US", options);

    // Replace "AM" or "PM" with lowercase equivalents
    return formattedTime.replace(/ (AM|PM)$/, (match) => match.toLowerCase());
  } catch (error) {
    console.error(
      "Invalid timestamp format. Please provide a valid ISO 8601 string."
    );
    return null; // Or return any appropriate value in case of error
  }
}

export function formatTimestampToTimeAgo(timestampString) {
  // Try parsing the timestamp string
  try {
    const timestamp = new Date(timestampString);
    const now = new Date();

    // Calculate the difference in milliseconds
    const difference = now - timestamp;

    // Define the time units
    const timeUnits = [
      { unit: "year", value: 31536000000 },
      { unit: "month", value: 2592000000 },
      { unit: "day", value: 86400000 },
      { unit: "hour", value: 3600000 },
      { unit: "minute", value: 60000 },
      { unit: "second", value: 1000 },
    ];

    // Iterate through the time units
    for (const unit of timeUnits) {
      const unitDifference = Math.floor(difference / unit.value);
      if (unitDifference > 0) {
        return `${unitDifference} ${unit.unit}${
          unitDifference > 1 ? "s" : ""
        } ago`;
      }
    }

    return "Just now";
  } catch (error) {
    console.error(
      "Invalid timestamp format. Please provide a valid ISO 8601 string."
    );
    return null; // Or return any appropriate value in case of error
  }
}
