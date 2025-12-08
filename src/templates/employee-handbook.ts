export default function employeeHandbookTemplate(values: {
  companyName: string
  effectiveDate: string
  workLocation: string
  workSchedule: string
  benefits: string
  codeOfConduct: string
  policies: string
}) {
  return `
  Generate a comprehensive **Employee Handbook** in professional formatting.
  
  Details:
  - Company Name: ${values.companyName}
  - Effective Date: ${values.effectiveDate}
  - Work Location: ${values.workLocation}
  - Work Schedule: ${values.workSchedule}
  - Benefits: ${values.benefits}
  - Code of Conduct: ${values.codeOfConduct}
  - Policies: ${values.policies}
  
  Requirements:
  - Use clear legal language
  - Include: Welcome Message, Company Overview, Employment Policies, Code of Conduct, Benefits, Time Off, Performance Expectations, Disciplinary Procedures, Acknowledgment
  - Output in clean markdown formatting
  `
}

