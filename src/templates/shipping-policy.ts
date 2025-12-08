export default function shippingPolicyTemplate(values: {
  businessName: string
  contactEmail: string
  shippingMethods: string
  processingTime: string
  shippingRates: string
  internationalShipping: string
  deliveryTimeframes: string
}) {
  return `
  Generate a legally compliant **Shipping Policy** in professional formatting.
  
  Details:
  - Business Name: ${values.businessName}
  - Contact Email: ${values.contactEmail}
  - Shipping Methods: ${values.shippingMethods}
  - Processing Time: ${values.processingTime}
  - Shipping Rates: ${values.shippingRates}
  - International Shipping: ${values.internationalShipping}
  - Delivery Timeframes: ${values.deliveryTimeframes}
  
  Requirements:
  - Use clear legal language
  - Include: Shipping Methods, Processing Times, Shipping Costs, Delivery Estimates, International Shipping, Lost/Damaged Packages, Tracking Information
  - Output in clean markdown formatting
  `
}

