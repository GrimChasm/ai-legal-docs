export default function photoVideoReleaseFormTemplate(values: {
  companyName: string
  participantName: string
  participantAge: string
  eventDate: string
  mediaType: string
  usagePurpose: string
  duration: string
  compensation: string
}) {
  return `
  Generate a legally compliant **Photo/Video Release Form** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Participant Name: ${values.participantName}
  - Participant Age: ${values.participantAge}
  - Event Date: ${values.eventDate}
  - Media Type: ${values.mediaType}
  - Usage Purpose: ${values.usagePurpose}
  - Duration: ${values.duration}
  - Compensation: ${values.compensation}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Grant of Rights, Media Type, Usage Rights, Duration, Compensation, Release of Claims, Minors (if applicable), Signature Lines
  - Output in clean markdown formatting
  `
}

