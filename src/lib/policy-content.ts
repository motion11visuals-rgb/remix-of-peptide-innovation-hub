import {
  BUSINESS_ADDRESS,
  QUALITY_REFUND_CREDIT,
  ORDER_PROCESSING_LABEL,
  SHIPPING_FLAT_RATE,
  PROCESSING_FEE,
} from "./store-policy";

export type PolicyContent = {
  title: string;
  description: string;
  sections: { title: string; paragraphs: string[] }[];
};

export const PRIVACY_POLICY: PolicyContent = {
  title: "Privacy Policy",
  description:
    "How Synthesia Labs handles order information, payment screenshots, browser storage, and visitor analytics.",
  sections: [
    {
      title: "Who we are",
      paragraphs: [
        `Synthesia Labs operates this research supply website. Our business address is ${BUSINESS_ADDRESS}. For privacy questions or requests, email synthesialabs1@gmail.com.`,
      ],
    },
    {
      title: "Information you provide",
      paragraphs: [
        "The entry screen stores your research affiliation, institution name, and acceptance date in your browser. We use these details to remember your research-use acknowledgment for 30 days and prefill order details. Your cart is also saved in your browser until you change or clear it. These are functional local-storage records, not analytics cookies; other people using the same browser may see them.",
        "At checkout, we collect your name, email, optional phone number, institution, affiliation, shipping address, order items, payment method, optional payment-account name and notes, and payment screenshot. Orders and screenshots are stored privately in Lovable Cloud and are available to authorized store operators to review payment and fulfill orders. Upload only the necessary confirmation details and obscure unrelated balances, transactions, or account numbers.",
        "If you voluntarily enter an email and select the promotional-email checkbox, your email, institution name, and signup timestamps are saved privately for marketing. Signing up is optional and is not required to shop. This website currently saves the list; promotional delivery through a separate newsletter service is not connected. You may request removal by emailing us. Any future promotional emails should include an unsubscribe option.",
      ],
    },
    {
      title: "Visitor analytics",
      paragraphs: [
        "Lovable's visitor analytics records page visits, where visitors came from, country, browser, operating system, device type, time on page, page loading speed, errors, and clicks on buttons and links. It uses no cookies, stores nothing on the visitor's device, does not keep IP addresses, and does not identify visitors. This site does not send separate custom app events beyond error reports.",
        "There is no analytics-consent banner connected on this site. Clicks are recorded for every visitor. Page visits, time on page, page speed, and errors are also recorded for every visitor, without cookies and without identifying anyone. Detailed data is kept for 90 days and daily summaries for one year.",
        "Lovable collects this data for us. Its privacy policy explains how it handles it.",
      ],
    },
    {
      title: "Other services and recipients",
      paragraphs: [
        "Lovable Cloud hosts the website and stores the order and signup information described above. Hosting and delivery providers process connection information as necessary to deliver and secure the service. We use order details to arrange delivery, and share necessary recipient and address details with the shipping carrier used for your order.",
        "The site loads fonts from Google Fonts. Google receives connection details, including your IP address and browser request information, when your browser requests those fonts. This is separate from Lovable's cookieless visitor analytics.",
        "Zelle, PayPal, and Cash App process payments in their own services; this site does not take card numbers or bank credentials. Payment QR images are displayed here, but payment takes place outside the site. Those providers receive the data you give them under their own terms and privacy policies. A screenshot is evidence for manual review, not automatic confirmation of settled payment.",
        "Selecting the WhatsApp link opens WhatsApp, operated by Meta, which receives information about your interaction and any message you send under its own privacy policy. Selecting an email link opens your email application; your email provider and our Gmail provider process the message. No advertising pixels or embedded chat widgets are configured in this site's code.",
      ],
    },
    {
      title: "Retention, choices, and security",
      paragraphs: [
        "We retain order records, payment evidence, and correspondence as reasonably necessary for fulfillment, disputes, security, and applicable tax and recordkeeping obligations. Marketing signup records are kept until removal is requested or they are no longer needed, subject to necessary consent records. These business records are separate from the fixed analytics retention described above.",
        "You can clear the site's cart and research acknowledgment through your browser's site-storage controls. Contact us to request access, correction, deletion, or marketing removal. We may need to verify your request and retain records where required or permitted by law. Privacy rights and restrictions differ by location. Security measures reduce risk, but no online transmission or storage can be guaranteed completely secure.",
      ],
    },
  ],
};

export const TERMS_POLICY: PolicyContent = {
  title: "Terms & Conditions",
  description: "Purchase terms and research-only restrictions for Synthesia Labs orders.",
  sections: [
    {
      title: "Eligibility and permitted purchases",
      paragraphs: [
        "You must be at least 21 years old and a qualified researcher acting for a legitimate laboratory or research organization. By submitting an order, you confirm that your details are accurate and that you have authority to purchase and handle the materials. We may request supporting information and decline orders that appear inconsistent with laboratory research.",
        "All products are chemical reagents for controlled in vitro laboratory research only. They are not for human or animal consumption, injection, administration, clinical use, or resale for those purposes. A research-use label does not authorize an otherwise unlawful activity.",
      ],
    },
    {
      title: "Orders, pricing, and payment",
      paragraphs: [
        `Prices are shown in US dollars. Shipping is $${SHIPPING_FLAT_RATE} per order unless the merchandise subtotal is more than $150, when shipping is free. An order of exactly $150 pays $${SHIPPING_FLAT_RATE} shipping. A flat $${PROCESSING_FEE} processing fee applies to every order, including orders with free shipping, and does not count toward the free-shipping threshold. Review the displayed final total before sending payment. Any legally required tax must be disclosed and handled in accordance with applicable law; this checkout currently displays merchandise, shipping, and processing charges.`,
        "Customers pay through the displayed Zelle, PayPal, or Cash App instructions and upload proof of completed payment. An order receipt acknowledges submission only; it does not establish that payment has settled or that the order has been accepted for fulfillment. Orders ship after payment verification and eligibility review. Never send us bank passwords or payment login credentials.",
        "Availability and pricing can change for future orders. If an error or stock issue affects a submitted order, we will contact you about a correction or refund instead of collecting an undisclosed additional charge. If we decline an order after receiving payment, we will arrange a refund of that payment.",
      ],
    },
    {
      title: "Research responsibilities and safety",
      paragraphs: [
        "You are responsible for appropriate laboratory facilities, training, protective equipment, safe handling, storage, lawful disposal, and compliance with laws applicable to your activities. Do not use this site's descriptions as medical advice, dosing guidance, or evidence of suitability for in vivo use. Product identity or purity information is not a representation of clinical safety or FDA approval.",
        "This site provides no medical advice. Statements have not been evaluated by the FDA. Products are not drugs, dietary supplements, or cosmetics, and are not intended to diagnose, treat, cure, or prevent any disease. Nothing on this site asserts FDA registration, authorization, or exemption.",
      ],
    },
    {
      title: "Quality remedies and limits",
      paragraphs: [
        `Our Return Policy covers substantiated cloudiness problems and failed laboratory tests supported by evidence: the affected peptide is refunded and $${QUALITY_REFUND_CREDIT} website credit is also provided. Contact us before sending materials back. This promise and any rights that cannot lawfully be excluded remain in effect.`,
        "To the extent permitted by law, we do not warrant suitability for a particular experiment or experimental outcome. To the extent permitted by law, liability for a particular product is limited to the amount paid for that product, and indirect or consequential experimental losses are excluded. These limits do not apply to fraud, willful misconduct, gross negligence, or liability and statutory remedies that applicable law does not allow us to exclude. No term excuses unlawful conduct or eliminates legally required product obligations.",
      ],
    },
    {
      title: "Policies, disputes, and updates",
      paragraphs: [
        "The Research Use Only, Shipping, Return, and Privacy Policies explain the related practices. Checkout requires an affirmative acknowledgment of these terms and policies. The version accepted with an order is recorded; later changes do not retroactively reduce the rights attached to that order.",
        "Please email synthesialabs1@gmail.com with your order reference to seek a resolution. Florida law governs these terms to the extent permitted, without displacing mandatory protections in your jurisdiction. Nothing requires you to waive non-waivable rights or use binding arbitration. If a provision is unenforceable, the remaining provisions apply to the extent lawful.",
      ],
    },
  ],
};

export const RESEARCH_POLICY: PolicyContent = {
  title: "Research Use Only Policy",
  description:
    "Controlled in vitro laboratory research requirements and prohibited uses for Synthesia Labs reagents.",
  sections: [
    {
      title: "For research use only. Not for human consumption.",
      paragraphs: [
        "Products are intended only for controlled in vitro laboratory research by qualified researchers. They are not intended to diagnose, treat, cure, or prevent disease. They must not be consumed, injected, administered to humans or animals, or used in clinical or other in vivo applications.",
      ],
    },
    {
      title: "Laboratory purchaser acknowledgment",
      paragraphs: [
        "Purchasers must be 21 or older, accurately identify their research affiliation and organization, and have the facilities, training, and authority needed to handle chemical reagents. You must follow applicable laboratory safety, chemical handling, storage, transport, and disposal requirements. We may request additional verification and decline orders if the intended use appears prohibited.",
      ],
    },
    {
      title: "No medical advice or FDA approval claim",
      paragraphs: [
        "This site does not provide medical advice, treatment recommendations, reconstitution instructions for human use, or dosing guidance. These statements have not been evaluated by the FDA. Products are not drugs and are not intended to diagnose, treat, cure, or prevent any disease.",
        "Research terminology, published studies, analytical results, or an RUO label do not establish that a product is safe for human use, authorized by the FDA, or exempt from applicable law. Purchasers must not market or redistribute these materials for prohibited uses.",
      ],
    },
    {
      title: "Quality or safety concerns",
      paragraphs: [
        "If a vial is damaged, appears cloudy under appropriate laboratory conditions, or fails an appropriate laboratory test, stop using the affected material in research and preserve photographs, packaging, lot information, and test evidence. Email synthesialabs1@gmail.com with your order reference. Consult our Return Policy for the quality remedy; never attempt to assess a product by consuming or administering it.",
      ],
    },
  ],
};

export const SHIPPING_POLICY: PolicyContent = {
  title: "Shipping Policy",
  description: `$${SHIPPING_FLAT_RATE} flat-rate shipping, with free shipping on merchandise orders over $150 at Synthesia Labs.`,
  sections: [
    {
      title: "Shipping charges",
      paragraphs: [
        `Shipping is a flat $${SHIPPING_FLAT_RATE} per order. Shipping is free when the merchandise subtotal is more than $150, before shipping and processing fees. Exactly $150 does not qualify and incurs the $${SHIPPING_FLAT_RATE} charge. A separate flat $${PROCESSING_FEE} processing fee applies to every order, including orders with free shipping. The order summary and payment amount include both applicable charges.`,
      ],
    },
    {
      title: "Order processing and delivery",
      paragraphs: [
        `Order processing takes ${ORDER_PROCESSING_LABEL} after payment has been verified and research eligibility has been reviewed. A screenshot alone is not confirmation that funds were received. Carrier transit time is additional and varies by service and destination; delivery dates are estimates, not guarantees.`,
        "This checkout collects a US shipping address. Contact us before paying if your destination or delivery needs are not supported. Do not assume that shipment to another country is available. We will contact you if a shipping restriction or unexpected delay affects your order.",
      ],
    },
    {
      title: "Address accuracy and shipment problems",
      paragraphs: [
        "Check your name and complete shipping address before submitting payment. Email synthesialabs1@gmail.com promptly with your order reference if a correction is needed; changes may not be possible once dispatched.",
        "For a lost, damaged, or incorrect shipment, contact us with your order reference and available photos. Keep the package and labeling so we can investigate with the carrier. We will work with you on an appropriate remedy; this policy does not remove any rights required by law.",
      ],
    },
  ],
};

export const RETURN_POLICY: PolicyContent = {
  title: "Return Policy",
  description:
    "Evidence-supported peptide quality refunds and additional website credit at Synthesia Labs.",
  sections: [
    {
      title: "Our quality remedy",
      paragraphs: [
        `If an affected peptide has a substantiated cloudiness problem or fails an appropriate laboratory test and you provide supporting proof, we refund the price paid for that peptide and also provide $${QUALITY_REFUND_CREDIT} website credit. The remedy applies to the affected peptide rather than automatically refunding unrelated items in the order. Claims, refunds, and credit are handled by our team; this site does not automatically issue refunds or redeem credit at checkout. Contact us to arrange use of approved credit before sending payment.`,
      ],
    },
    {
      title: "How to submit a claim",
      paragraphs: [
        "Email synthesialabs1@gmail.com with your order reference, peptide name and size, lot number if available, and a description of the problem. For cloudiness, include clear photographs and relevant laboratory preparation and storage details. For a failed test, include the laboratory report, test method, measured result, applicable specification, and evidence linking the tested sample to the purchased lot.",
        "We review the evidence to determine whether the issue concerns the supplied peptide, including whether the test and sample handling were appropriate. We may request reasonable additional documentation; a denial should include an explanation. A payment screenshot proves payment submission, not peptide quality. Preserve the affected material safely and stop using it in research while the claim is reviewed.",
      ],
    },
    {
      title: "Refunds, credit, and returns",
      paragraphs: [
        "Once the quality issue is substantiated, we arrange the affected-peptide refund through the original payment method where supported, or another method agreed with you. Payment providers may take additional time to post refunds. We also confirm the website credit in writing; credit is separate from the cash refund and is not offered in place of it.",
        "Do not mail chemical reagents back without instructions and authorization. We will explain whether a return is needed and the safe, lawful return procedure. Quality claims are not automatically rejected merely because a vial was opened for appropriate laboratory testing. Shipping charges and other remedies are addressed according to the circumstances and applicable law.",
        "This is a quality-related remedy, not a promise of a particular research outcome or a general change-of-mind return program. Nothing in this policy limits remedies or rights that cannot lawfully be waived.",
      ],
    },
  ],
};

export const ACCESSIBILITY_POLICY: PolicyContent = {
  title: "Accessibility",
  description: "Accessibility assistance and feedback for the Synthesia Labs website.",
  sections: [
    {
      title: "Our goal",
      paragraphs: [
        "We aim to make product information, research policies, and checkout usable for visitors with disabilities. We seek to improve keyboard access, readable content, labeled controls, and compatibility with assistive technology. We have not completed an independent accessibility audit and do not claim that every page or third-party service fully conforms to an accessibility standard.",
      ],
    },
    {
      title: "Request assistance or report a barrier",
      paragraphs: [
        "Email synthesialabs1@gmail.com if a page, research entry screen, payment QR code, or checkout step is difficult to use. Include the page address, what you were trying to do, and the assistive technology or browser involved if you wish. Please do not send sensitive financial or medical information.",
        "We will review the issue and work with you on an accessible way to obtain information or submit an eligible research order. Payment providers and WhatsApp operate independently; we can help identify an alternative contact or payment instruction when their services present a barrier.",
      ],
    },
  ],
};
