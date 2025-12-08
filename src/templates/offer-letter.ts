export default function offerLetter(values: {
  companyName: string
  employeeName: string
  jobTitle: string
  startDate: string
  salary: string
  workLocation: string
  benefits: string
}) {
    return `
  Generate a professional **Employment Offer Letter**.
  
  Details:
  - Company Name: ${values.companyName}
  - Employee Name: ${values.employeeName}
  - Job Title: ${values.jobTitle}
  - Start Date: ${values.startDate}
  - Salary: ${values.salary}
  - Work Location: ${values.workLocation}
  - Benefits: ${values.benefits}
  
  Include:
  - Congratulations & Position Summary
  - Compensation
  - Start Date
  - Employment Status (at-will unless stated)
  - Benefits
  - Contingencies (background check, etc.)
  - Signature lines
  
  Use clean markdown.
  `
  }
  