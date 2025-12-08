export default function employmentContractTemplate(values: {
  companyName: string
  employeeName: string
  jobTitle: string
  startDate: string
  salary: string
  workLocation: string
  workSchedule: string
  benefits: string
  terminationTerms: string
  jurisdiction: string
}) {
  return `
  Generate a legally compliant **Employment Contract** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Employee Name: ${values.employeeName}
  - Job Title: ${values.jobTitle}
  - Start Date: ${values.startDate}
  - Salary: ${values.salary}
  - Work Location: ${values.workLocation}
  - Work Schedule: ${values.workSchedule}
  - Benefits: ${values.benefits}
  - Termination Terms: ${values.terminationTerms}
  - Jurisdiction: ${values.jurisdiction}
  
  Requirements:
  - Use clear legal language
  - Include: Parties, Position & Duties, Compensation, Work Schedule, Benefits, Confidentiality, Termination, Governing Law, Signature Lines
  - Output in clean markdown formatting
  `
}

