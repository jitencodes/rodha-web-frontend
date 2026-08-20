export interface LegalSection {
  id: string;
  title: string;
  /** Paragraph strings and/or bullet / ordered lists */
  content: Array<
    | string
    | { type: "list"; items: string[] }
    | { type: "ordered-list"; items: string[] }
  >;
}

export interface LegalPageContent {
  slug: string;
  title: string;
  lastUpdated: string;
  description: string;
  sections: LegalSection[];
}

export const LEGAL_CONTACT = {
  email: "raviprakash@rodha.co.in",
  phone: "+91-7982212160",
  address: "No. 7714, 7th Floor, Block C, Pranavas BSR Gitaaar, Panthur, Bangalore, Karnataka, 560103",
  grievanceOfficer: "Grievance Officer, Rodha Educational Services Private Limited",
};

export const PRIVACY_POLICY: LegalPageContent = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  lastUpdated: "August 2026",
  description: "How Rodha Educational Services Private Limited collects, uses, stores, and protects learner information on the Rodha platform.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: [
        "This Privacy Policy (the \"Policy\") governs the manner in which the Platform collects, uses, maintains and discloses information of its users. The Policy also describes the practices that We apply to such user information, user's privacy rights and choices regarding their information. To clarify, this Policy applies to all users of the Platform (referred to as \"Learners\", \"You\", \"Your\").",
        "By accessing and using the Platform, providing Your Personal Information, or by otherwise signalling Your agreement when the option is presented to You, You consent to the collection, use, and disclosure of information described in this Policy and Terms of Use and we disclaim all the liabilities arising therefrom. If You do not agree with any provisions of this Policy and/or the Terms of Use, You should not access or use the Platform or engage in communications with us and are required to leave the Platform immediately.",
        "If any information You have provided or uploaded on the Platform violates the terms of this Policy or Terms of Use, we may be required to delete such information upon informing You of the same and revoke Your access if required without incurring any liability to You. Capitalized terms used but not defined in this Privacy Policy can be found in our Terms of Use.",
        "Please read this Policy carefully prior to accessing our Platform and using any of the services or products offered therein. If you have any questions, please contact us at the contact information provided below."
      ],
    },
    {
      id: "personal-information",
      title: "1. Personal Information",
      content: [
        "\"Personal Information\" shall mean the information which identifies a Learner i.e., first and last name, identification number, email address, age, gender, location, photograph and/or phone number provided at the time of registration or any time thereafter on the Platform.",
        "\"Sensitive Personal Information\" shall include (i) passwords and financial data (except the truncated last four digits of credit/debit card), (ii) health data, (iii) official identifier (such as biometric data, aadhar number, social security number, driver's license, passport, etc.,), (iv) information about sexual life, sexual identifier, race, ethnicity, political or religious belief or affiliation, (v) account details and passwords, or (vi) other data/information categorized as 'sensitive personal data' or 'special categories of data' under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, General Data Protection Regulation (GDPR) and / or the California Consumer Privacy Act (CCPA) (\"Data Protection Laws\") and in context of this Policy or other equivalent / similar legislations. Usage of the term 'Personal Information' shall include 'Sensitive Personal Information' as may be applicable to the context of its usage."
      ],
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: [
        "We may collect both personal and non-personal identifiable information from You in a variety of ways, including, but not limited to, when You visit our Platform, register on the Platform, and in connection with other activities, services, features or resources we make available on our Platform. However, please note that:",
        { type: "list" as const, items: ["We do not ask You for Personal Information unless we truly need it; like when You are registering for any Content on the Platform.","We do not share Your Personal Information with anyone except to comply with the applicable laws, develop our products and services, or protect our rights.","We do not store Personal Information on our servers unless required for the on-going operation of our Platform."] },
        "2.1 Personal Identifiable Information: We may collect personal-identifiable information such as Your name and email address to enable Your access to the Platform and services/products offered therein. We will collect personal-identifiable information from You only if such information is voluntarily submitted by You to us. You can always refuse to provide such personal identification information; however, it may prevent You from accessing services or products provided on the Platform or from engaging in certain activities on the Platform.",
        "2.2 Non-Personal Identifiable Information: When You interact with our Platform, we may collect non-personal-identifiable information such as the browser name, language preference, referring site, and the date and time of each user request, operating system and the Internet service providers utilized and other similar information.",
        "2.3 Cookies: To enhance User experience, our Platform may use 'cookies'. A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns for record-keeping purposes. You may choose to set Your web browser to refuse cookies, or to notify You when cookies are being sent; however, please note that in doing so, some parts of the Platform may not function properly."
      ],
    },
    {
      id: "how-we-use",
      title: "3. How We Use and Share the Information Collected",
      content: [
        "We may collect and use Your Personal Information for the following purposes:",
        "3.1 To provide access to our Platform and/or the services/products offered therein: We use Your information as collected by us to allow You to access the Platform and the services/products offered therein, including without limitation to provide customer service, fulfil purchases through the Platform, verify User information and to resolve any glitches with our Platform. The legal basis for this processing is consent or, where applicable, our legitimate interests in the proper administration of our Platform, and/or the performance of a contract between You and us.",
        "3.2 To improve our Platform and maintain safety: We use Your information to improve and customize the Platform and services/products offered by us. Further, we also use Your information to prevent, detect, investigate, and take measures against criminal activity, fraud, misuse of or damage to our Platform or network, and other threats and violations to a third party's or our rights and property, or the safety of our Users, or others.",
        "3.3 To communicate with You or market our services/products: We may use the email address submitted by You to communicate with You about Your orders on our Platform, our offers, new products, services or even receive Your feedback on the Platform or any services/products offered therein. It may also be used to respond to Your inquiries, questions, and/or other requests. If at any time You would like to unsubscribe from receiving future emails, please write to us at the contact information provided below.",
        "We do not use Personal Information for making any automated decisions affecting or creating profiles other than what is described in this Policy. We do not sell, trade, or otherwise exploit Your personal-identifiable information to others. Limited to the purposes stated hereinabove, we may share generic aggregated demographic information not linked to any personal-identifiable information regarding visitors and Users with our business partners and trusted affiliates."
      ],
    },
    {
      id: "your-choices",
      title: "4. Your Choices",
      content: [
        "4.1 Limit the information You provide: You always have an option to choose the information You provide to us, including the option to update or delete Your information. However, please note that lack of certain information may not allow You access to the Platform or any of its features, in part or in full. For example: information required for Your registration on the Platform.",
        "4.2 Limit the communications You receive from us: Further, You will also have the option to choose what kind of communication You would like to receive from us. However, there may be certain communications that are required for legal or security purposes, including changes to various legal agreements, that you may not be able to limit.",
        "4.3 Reject Cookies and other similar technologies: You may reject or remove cookies from Your web browser; You will always have the option to change the default settings on Your web browser if the same is set to 'accept cookies'. However, please note that some of the services/products offered on the Platform may not function or be available to You, when the cookies are rejected, removed or disabled."
      ],
    },
    {
      id: "your-rights",
      title: "5. Your Rights",
      content: [
        "In general, all Learners have the rights specified herein this section. However, depending on where you are situated, you may have certain specific rights in respect of your Personal Information accorded by the laws of the country you are situated in. To understand Your rights, please refer to the Country Specific Additional Rights below.",
        "If you are a Learner, you may exercise any of these rights by using the options provided to you within the Platform upon your login. If however, you are facing any issues or require any clarifications, you can always write to us at the address noted in the 'Grievances' section below, and we will address your concerns to the extent required by the applicable law.",
        { type: "list" as const, items: ["Right to Confirmation and Access: You have the right to get confirmation and access to your Personal Information that is with us along with other supporting information.","Right to Correction: You have the right to ask us to rectify your Personal Information that is with us that you think is inaccurate. You also have the right to ask us to update your Personal Information that you think is incomplete or out-of-date.","Right to be Forgotten: You have the right to restrict or prevent the continuing disclosure of your Personal Information under certain circumstances.","Right to Erasure: If you wish to withdraw/remove your Personal Information from our Platform, you have the right to request erasure of your Personal Information from our Platform. However, please note that such erasure will remove all your Personal Information from our Platform (except as specifically stated in this Policy) and may result in deletion of your account on the Platform permanently, and the same will not be retrievable."] },
        "Remember, you are entitled to exercise your rights as stated above only with respect to your information, including Personal Information, and not that of other Learners. Further, when we receive any requests or queries over email to the address specified in the 'Grievances' section below, then, as per the applicable Data Protection Laws, we may need to ask you a few additional information to verify your identity in association with the Platform and the request received."
      ],
    },
    {
      id: "protection",
      title: "6. Protection of Your Information",
      content: [
        "We take all measures reasonably necessary to protect against the unauthorized access, use, alteration or destruction of Personal Information or such other data on the Platform. Our disclosure of any such information is limited to:",
        { type: "list" as const, items: ["our employees, contractors and affiliated organizations (if any) that (i) need to know that information in order to process it on our behalf or to provide services available on our Platform, and (ii) that have agreed not to disclose it to others.","a response to a court order, or other governmental request."] },
        "Without limitation to the foregoing, we reserve the right to disclose such information where we believe in good faith that such disclosure is necessary to:",
        { type: "list" as const, items: ["comply with applicable laws, regulations, court orders, government and law enforcement agencies' requests;","protect and defend a third party's or our rights and property, or the safety of our users, our employees, or others; or","prevent, detect, investigate and take measures against criminal activity, fraud and misuse or unauthorized use of our Platform and/or to enforce our Terms of Use or other agreements or policies."] },
        "To the extent permitted by law, we will attempt to give You prior notice before disclosing Your information in response to such a request."
      ],
    },
    {
      id: "third-party",
      title: "7. Third Party Websites",
      content: [
        "You may find links to the websites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. The content or links that appear on these sites are not controlled by us in any manner and we are not responsible for the practices employed by such websites. Further, these websites/links thereto, including their content, may be constantly changing and they may have their own terms of use and privacy policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that terms and policies published on such websites."
      ],
    },
    {
      id: "cross-border",
      title: "8. Cross-Border Data Transfer",
      content: [
        "Your information including any Personal Information is stored, processed, and transferred in and to the Amazon Web Service (AWS) servers and databases located in India. We may also store, process, and transfer information in and to servers in other countries depending on the location of our affiliates and service providers. Please note that these countries may have differing (and potentially less stringent) privacy laws and that Personal Information can become subject to the laws and disclosure requirements of such countries, including disclosure to governmental bodies, regulatory agencies, and private persons, as a result of applicable governmental or regulatory inquiry, court order or other similar process.",
        "If you use our Platform from outside India, including in the USA, EU, EEA, and UK, your information may be transferred to, stored, and processed in India. By accessing our Platform or otherwise giving us information, you consent to the transfer of information to India and other countries outside your country of residence."
      ],
    },
    {
      id: "duration",
      title: "9. Duration for Which Your Information Is Stored",
      content: [
        "We will retain Your information for as long as it is required for us to retain for the purposes stated hereinabove, including for the purpose of complying with legal obligation or business compliances. Further, please note that we may not be able to delete all communications or photos, files, or other documents publicly made available by you on the Platform (for example: comments, feedback, etc.), however, we shall anonymize your Personal Information in such a way that you can no longer be identified as an individual in association with such information made available by you on the Platform. We will never disclose aggregated or de-identified information in a manner that could identify you as an individual.",
        "Note: If you wish to exercise any of your rights (as specified in 'Your Rights' section) to access, modify and delete any or all information stored about you, then you may do so by using the options provided within the Platform. You can always write to us at the email address specified in the 'Grievances' section below."
      ],
    },
    {
      id: "modification",
      title: "10. Modification to Privacy Policy",
      content: [
        "We may modify, revise or change our Policy from time to time; when we do, we will revise the 'updated date' at the beginning of this page. We encourage You to check our Platform frequently to see the recent changes. Unless stated otherwise, our current Policy applies to all information that we have about You."
      ],
    },
    {
      id: "grievances",
      title: "11. Grievances",
      content: [
        "If you have any questions about this Policy, wish to exercise your rights, concerns about privacy or grievances, please write to us with a thorough description via email to raviprakash@rodha.co.in."
      ],
    },
    {
      id: "country-specific",
      title: "12. Country Specific Additional Rights",
      content: [
        "12.1 Terms applicable if you are an Indian resident: If you are located in India, you may have rights under applicable Indian data protection law. All requests can be made by using the options provided to you within the Platform upon your login, or by writing to us as stated in the Grievances section above.",
        { type: "list" as const, items: ["Right to Confirmation and Access","Right to Correction","Right to Data Portability","Right to be Forgotten","Right to Erasure"] },
        "12.2 Terms applicable if you are a resident of the United Kingdom (UK), a European Union (EU) country or European Economic Area (EEA): You may have rights under the UK and EU General Data Protection Regulation (GDPR), including access, rectification, erasure, objection to processing, restriction of processing, data portability, the right to lodge a complaint with a supervisory authority, and the right not to be subject to automated decision-making including profiling, where applicable. Requests should be sent to the address noted in the Grievances section.",
        "12.3 Terms applicable if you are a California State Resident: To the extent set out in the CCPA, you may have rights to access, know what Personal Information we intend to collect before the point of collection, opt in or out of marketing/analytics and similar activities, equal services without discrimination, and request deletion of Personal Information. Requests may be submitted by email to the address in the Grievances section.",
        "We have not sold categories of Personal Information during the preceding 12 months. Categories of Personal Information that may be collected include identifiers, characteristics described in the California Customer Records statute, internet or other electronic network activity information, geolocation data, audio/electronic/visual information, and inferences."
      ],
    }
  ],
};

export const TERMS_AND_CONDITIONS: LegalPageContent = {
  slug: "terms-and-conditions",
  title: "Terms of Use",
  lastUpdated: "August 2026",
  description: "Terms and conditions governing use of the Rodha website, application, content, and related services.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: [
        "These Terms of Use set out the terms and conditions for use of this RODHA (\"Website\") and any content, Public Forums, or services offered on or through the Website and/or through any mobile application(s) (\"Application\") (collectively referred to as the \"Platform\"). These Terms of Use apply to end users of the Website (referred to as \"Learners\", \"You\", \"Your\").",
        "These Terms of Use, including the Privacy Policy and any other terms and conditions published on the Platform or communicated to you from time to time (collectively referred to as the \"Agreement\"), define the relationship and responsibilities between You and Creator (as defined herein) in using the Platform. Your access to the Platform is subject to Your acceptance of this Agreement.",
        "When we speak of \"Creator\", 'we', 'us', and 'our', we collectively mean RODHA being the creator of this Platform and the content/materials/services contained therein. By accessing this Platform, You are agreeing to be bound by the terms of this Agreement, all applicable laws and regulations. If You disagree with any part of this Agreement or do not wish to be bound by the same, then please do not use the Platform in any manner."
      ],
    },
    {
      id: "access-registration",
      title: "1. Access and Registration",
      content: [
        "If You're an individual You must be at least 18 (eighteen) years of age, or, if You are between the ages of 13 and 18, You must have Your parent or legal guardian's permission to use the Platform. By using the Platform, You are, through Your actions, representing and warranting to us that You have obtained the appropriate consents/permissions to use the Platform. If You are under the age of 13 years or 16 years (depending on your country of residence), You may neither use our Platform in any manner nor may You register for any content or services offered therein.",
        "To access any Content (as defined below) offered on the Platform, we require You to register for the same by providing Your name and email address. Please read our Privacy Policy to understand how we handle Your information. Further, You may also be required to make payment of a fee to access the Content, if applicable. For more information, please read our Payments & Refunds section and the Refund Policy.",
        "For the purpose of this Agreement, \"Content\" shall mean and include any course or session (whether pre-recorded or live) published by the Creator on the Platform, including, but not limited to any reference materials and text files (if any) offered to You as part of the Content. When You register or enrol for any Content on the Platform, You may also have access to discussion forums that enables You to exchange Your thoughts, knowledge in relation to the Content or its subject-matter, with us and other registrants to the Content (\"Public Forum\").",
        "Participating in the Public Forum is completely Your choice. We maintain and reserve the right to refuse access to the Platform or remove content posted by You in the Public Forums, at any time without notice to You, if, in our opinion, You have violated any provision of this Agreement.",
        "To access the Platform and/or view the content on the Platform, You will need to use a \"Supported/Compatible Device\". The Supported/Compatible Devices to access the Platform may change from time to time."
      ],
    },
    {
      id: "license",
      title: "2. License to Use",
      content: [
        "You are granted a limited, non-exclusive license to access and view the Content on the Platform for Your own personal, non-commercial use only. Further, if so allowed on the Platform, You may temporarily download one copy of any downloadable Content on the Platform for personal and non-commercial transitory viewing only. This license does not grant You the right to assign or sublicense the license granted under this Agreement to anyone else. Further, You may not:",
        { type: "list" as const, items: ["modify, edit or copy the Content, Creator Content or any material made available on the Platform;","create derivative works or exploit any material made available on the Platform (including the Content and Creator Content) or any portion thereof in a manner that is not permitted under this license;","publicly display (commercially or non-commercially) the Content, Creator Content or any material made available on the Platform or otherwise use the same for any commercial purpose;","attempt to decompile or reverse engineer any software contained in the Platform;","remove any copyright or other proprietary notations from the Content, Creator Content or any material made available on the Platform; or","transfer any material made available on the Platform to another person or 'mirror' the same on any other server."] },
        "For the purpose of this Agreement, \"Creator Content\" shall mean and include any audio files, video files, audio-visual files, images, text materials (including .doc, .docx, and .pdfs) (other than the Content) uploaded or otherwise published on the Platform by the Creator to be accessed by You, including, but not limited to any such content/material posted by the Creator in any Public Forum.",
        "This license shall automatically terminate if You violate any of these restrictions and may be terminated by us at any time. Upon termination of this license granted to You or Your viewing of any material on the Platform (including Content and Creator Content), You must destroy any downloaded materials in Your possession (whether in electronic or printed format)."
      ],
    },
    {
      id: "communications",
      title: "3. Communications",
      content: [
        "The Platform includes provision and facilitation of Public Forums designed to enable You to communicate with us and other registrants to the Content You have registered for. Use of these Public Forums are completely your choice. However, if You choose to participate, You agree to adhere to the terms specified in the Code of Conduct section hereinbelow and such other terms as may be published on our Platform.",
        "You represent and warrant that You own and control all rights in and to any content (including without limitation chats, postings, or materials) uploaded or posted by You on the Public Forums or anywhere on the Platform (\"Learner Content\"), or that You are licensed to use and reproduce such Learner Content. We are not responsible for the information that You choose to share on the Public Forums, or for the actions of other users therein.",
        "You further understand and agree that You shall be solely responsible for the Learner Content including its legality, reliability, accuracy, and appropriateness, and the consequences of its publication. Further, if you do post content or submit any Learner Content on the Platform, and unless otherwise indicated by You in writing (emails included) to us, You hereby grant us a non-exclusive, royalty-free, irrevocable, perpetual and fully sublicensable rights to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such Learner Content throughout the world in any media."
      ],
    },
    {
      id: "code-of-conduct",
      title: "4. Code of Conduct",
      content: [
        "You agree to the following:",
        { type: "list" as const, items: ["Legitimate usage of the Platform: Use the Platform only for lawful purposes and do not engage in activity that violates applicable law or regulation.","No harmful or dangerous content: Content which incites or promotes violence, that may cause physical or emotional harm or that may endanger the safety of any individual is prohibited.","No hateful or defamatory content: We do not encourage or tolerate hate speech or statements that are libelous, slanderous, threatening, violent, predatory, or defamatory.","No violent and graphic content intended solely to sensationalise, shock or disturb individuals.","No harassment and bullying, including revealing someone's personal information or sexual harassment in any form.","No spam: Posting untargeted, unwanted and repetitive content with an intention to spam a Public Forum or drive traffic to third-party sites is prohibited.","No scams, extortion, or blackmail.","Respect privacy of other Users as described in our Privacy Policy.","No impersonation of another person, learner, company, institute, or group.","No unauthorized access or disabling of the Platform, including denial-of-service attacks, malware, or interference with other users."] },
        "If any violation of the above rules of conduct comes to our notice, then, we reserve the right to refuse Your access to the Platform, terminate accounts or remove such violating content at any time without notice to You."
      ],
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property",
      content: [
        "We own all information and materials, including Content and Creator Content (in whatever form or media) provided or communicated to You by or on behalf of us including but not limited to, the Platform, trademarks, trade dress, logos, wordmarks, illustrations, letters, images, ideas, concepts, the layout, design, flow, look and feel of the Platform, logos, marks, graphics, audio files, video files, any software which is owned by or licensed to us, instructions embedded in any form of digital documents and other data, information, or material made available to You by us (\"Creator's Intellectual Property\").",
        "Creator's Intellectual Property, including the copyrights and trademarks contained therein, may not be modified by You in any way. You acknowledge and agree that You do not acquire any ownership rights to Creator's Intellectual Property by use of the Platform or any part thereof."
      ],
    },
    {
      id: "feedback",
      title: "6. Feedback",
      content: [
        "If You submit suggestions, ideas, comments, or questions containing product feedback about any Content, the Platform or any part thereof, either through the Public Forum or otherwise (\"Feedback\"), then You grant to us a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable right to use (and full right to sublicense), reproduce, modify, adapt, publish, translate, create derivative works from, distribute, transmit, and display such Feedback in any form. You shall have no intellectual property right in any Content, Platform or any part thereof, as a result of our incorporation of Feedback into any Content or the Platform."
      ],
    },
    {
      id: "payments-refunds",
      title: "7. Payments and Refunds",
      content: [
        "To register/enrol for any Content, You may need to pay a fee as may be applicable (\"Content Fee\"). Please refer to our Platform to know the pricing. Payment of such Content Fee shall be processed through third-party payment processors. Your payments may be subject to applicable taxes.",
        "Once You purchase access to a Content on the Platform, the same cannot be cancelled and there shall be no refund of the Content Fee, unless otherwise stated in our Refund Policy. We use third-party service providers to enable You to make payment for the purchases made on the Platform. Accordingly, it is hereby clarified that we do not capture and/or store any of your sensitive personal information. While making payments through such third-party payment gateways/service providers kindly ensure to read through their terms and conditions."
      ],
    },
    {
      id: "disclaimer",
      title: "8. Disclaimer",
      content: [
        "THE PLATFORM IS PROVIDED TO YOU \"AS IS\" AND \"AS AVAILABLE\" AND WITH ALL FAULTS AND DEFECTS WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE CREATOR, ON ITS OWN BEHALF AND ON BEHALF OF ITS AFFILIATES AND ITS AND THEIR RESPECTIVE LICENSORS AND SERVICE PROVIDERS, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE, WITH RESPECT TO THE PLATFORM, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE OR TRADE PRACTICE.",
        "WITHOUT LIMITATION TO THE FOREGOING, THE CREATOR PROVIDES NO WARRANTY OR UNDERTAKING, AND MAKES NO REPRESENTATION OF ANY KIND THAT THE PLATFORM OR THE SERVICES OR PRODUCTS OFFERED THEREIN WILL MEET YOUR REQUIREMENTS, ACHIEVE ANY INTENDED RESULTS, BE COMPATIBLE OR WORK WITH ANY OTHER SOFTWARE, APPLICATIONS, SYSTEMS OR SERVICES, OPERATE WITHOUT INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS OR BE ERROR FREE OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE CORRECTED.",
        "WITHOUT LIMITING THE FOREGOING, THE CREATOR MAKES NO REPRESENTATION OR WARRANTY OF ANY KIND, EXPRESS OR IMPLIED: (I) AS TO THE OPERATION OR AVAILABILITY OF THE PLATFORM, OR THE INFORMATION, CONTENT, AND MATERIALS OR PRODUCTS INCLUDED THEREON; (II) THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE; (III) AS TO THE ACCURACY, RELIABILITY, OR CURRENCY OF ANY INFORMATION OR CONTENT PROVIDED THROUGH THE PLATFORM; OR (IV) THAT THE PLATFORM, ITS SERVERS, THE CONTENT, OR E-MAILS SENT FROM OR ON BEHALF OF THE CREATOR ARE FREE OF VIRUSES, SCRIPTS, TROJAN HORSES, WORMS, MALWARE, TIMEBOMBS OR OTHER HARMFUL COMPONENTS.",
        "SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN TYPES OF WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO SOME OR ALL OF THE ABOVE EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU. BUT IN SUCH A CASE THE EXCLUSIONS AND LIMITATIONS SET FORTH IN THIS SECTION SHALL BE APPLIED TO THE GREATEST EXTENT ENFORCEABLE UNDER APPLICABLE LAW."
      ],
    },
    {
      id: "limitation",
      title: "9. Limitation of Liability",
      content: [
        "In no event shall the Creator be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Content or any other materials on the Platform, even if the Creator or any authorized personnel of the Creator has been notified orally or in writing of the possibility of such damage. Some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, so, some or all of these limitations may not apply to You."
      ],
    },
    {
      id: "indemnity",
      title: "10. Indemnity and Release",
      content: [
        "You shall indemnify and hold harmless the Creator and where applicable, its officers, directors, agents and employees, from any claim or demand, or actions including reasonable attorney's fees, made by any third party or penalty imposed due to or arising out of Your breach of this Agreement or any document incorporated by reference, or Your violation of any law, rules, regulations or the rights of a third party."
      ],
    },
    {
      id: "third-party-links",
      title: "11. Links to Third Party Website",
      content: [
        "Creator has not reviewed all of the sites linked to its Platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by the Creator of such site. Use of any such linked website is at Your own risk."
      ],
    },
    {
      id: "governing-law",
      title: "12. Governing Law and Jurisdiction",
      content: [
        "Any claim relating to the Platform shall be governed by the laws of the Creator's home jurisdiction (as provided on the Platform) without regard to its conflict of law provisions. You agree, as we do, to submit to the exclusive jurisdiction of the courts at Creator's home jurisdiction."
      ],
    },
    {
      id: "miscellaneous",
      title: "13. Miscellaneous",
      content: [
        { type: "list" as const, items: ["Alteration of Platform or Amendments to the Conditions: We reserve the right to make changes to our Platform, policies, and this Agreement at any time. We will post the new terms with a revision date indicated at the top or if deemed practicable. You should check our Platform frequently to see recent changes.","Waiver: If You breach these conditions and we take no action, we will still be entitled to use our rights and remedies in any other situation where You breach these conditions.","Assignment: You may not assign or transfer this Agreement, by operation or law or otherwise. Any attempt by You to assign or transfer this Agreement will be null and void.","Severability: If any provision of this Agreement will be adjudged by any court of competent jurisdiction to be unenforceable or invalid, that provision will be limited to the minimum extent necessary so that this Agreement will otherwise remain in effect.","Events beyond our reasonable control: We will not be held responsible for any delay or failure to comply with our obligations under these conditions if the delay or failure arises from any cause which is beyond our reasonable control. This condition does not affect Your statutory rights."] }
      ],
    },
    {
      id: "contact",
      title: "14. Contact Us",
      content: [
        "If You've concerns or queries regarding this Agreement, You may write to us by email at raviprakash@rodha.co.in."
      ],
    }
  ],
};

export const REFUND_POLICY: LegalPageContent = {
  slug: "refund-policy",
  title: "Refund, Cancellation and Access Policy",
  lastUpdated: "01 April 2026",
  description: "Refund, cancellation and access rules for Rodha Educational Services Private Limited products and services.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: [
        "Effective Date: 01st April 2026",
        "This Refund, Cancellation and Access Policy applies to all products and services offered by Rodha Educational Services Private Limited through its website, app, mock portal, payment links, and any other official sales channel operated by Rodha. By purchasing any product from Rodha, the learner agrees to this Policy, the applicable product page terms, and Rodha's general Terms of Use."
      ],
    },
    {
      id: "scope",
      title: "1. Scope of this Policy",
      content: [
        "This Policy applies to, including but not limited to:",
        { type: "list" as const, items: ["Live online batches","Recorded courses","Comprehensive courses and bundled programs","Mock tests and test series","Sectional tests","Study material and physical booklets","Workshop-based products","Booster courses","OMET, CAT, CLAT, IPMAT, SSC, GDPI and similar preparation products","Any combo, upgrade, add-on, or bundled offering sold by Rodha"] }
      ],
    },
    {
      id: "definitions",
      title: "2. Key Definitions",
      content: [
        { type: "list" as const, items: ["\"Enrollment\" — Successful purchase and confirmation of order.","\"Access\" or \"Access Activation\" — Means the learner is able to log in and view, attend, attempt, download, stream, or otherwise use any part of the purchased product.","\"Use\" — Includes, without limitation, attending a live class, viewing any recording, opening course content, joining any batch/group related to the course, downloading any file or material, attempting any mock/sectional/test, or availing any academic/support feature associated with the product.","\"Course Validity\" — The maximum period for which access is available on the platform. It does not mean that the fee is charged on a month-wise basis, unless explicitly stated otherwise on the product page.","\"Physical Material\" — Includes books, booklets, printed modules, or any other item shipped physically.","\"Bundled Product\" — Any product sold as a package including two or more components such as live classes, recordings, mocks, study material, boosters, OMET modules, doubt support, strategy sessions, or physical material."] }
      ],
    },
    {
      id: "general-principle",
      title: "3. General Refund Principle",
      content: [
        "Rodha's products are primarily educational access products, digital learning services, and bundled academic programs.",
        "Unless expressly stated otherwise on the relevant product page, all enrollments are final once access has been activated.",
        "The course fee is charged for the overall product, seat reservation, platform access, academic delivery, technology infrastructure, support, and bundled components offered with the product. It is not a month-wise subscription and does not create any automatic right to a month-wise or pro rata refund based on partial usage, reduced usage, or non-usage.",
        "Accordingly, the following do not make a product refundable:",
        { type: "list" as const, items: ["Non-attendance","Non-login","Non-attempt of mocks/tests","Non-use of the remaining validity period","Claiming refund merely because a portion of the validity period remains unused"] }
      ],
    },
    {
      id: "product-wise",
      title: "4. Product-wise Refund Rules",
      content: [
        "4.1 Live Batches and Comprehensive Courses — This category includes products containing one or more of the following: live classes, recorded backup, mock tests, physical booklets, sectionals, boosters, support, OMET preparation, workshops, or similar bundled services. A refund will not be available once any of the following has occurred: access has been activated; any class has been attended; any recording or content has been opened; any mock, test, sectional, or analysis has been accessed or attempted; any physical material has been dispatched; or any bundled benefit has been availed. For these products, the course validity shown on the product page is only the outer access period and shall not be treated as a refundable balance period.",
        "4.2 Recorded Courses and Digital-Only Products — For purely recorded or digital-only products, no refund shall be available once access has been activated or any content has been opened, viewed, streamed, downloaded, or otherwise used.",
        "4.3 Mock Tests, Test Series, Sectionals, and Analysis Products — No refund shall be available once any test, mock, sectional, solution, analysis dashboard, rank list, video solution, or related feature has been accessed or attempted.",
        "4.4 Workshops, Bootcamps, and Short-Term Programs — No refund shall be available once access has been activated, session links have been shared, or the workshop/program has commenced, whichever is earlier.",
        "4.5 Bundles, Combo Products, and Add-ons — Where a product is sold as a combined package, the package shall be treated as a single composite product unless expressly stated otherwise. Individual components of a bundle are not separately refundable; non-use of one component does not entitle the learner to refund of that component; free items, bonus items, complimentary modules, or promotional inclusions do not carry standalone refundable value."
      ],
    },
    {
      id: "physical-material",
      title: "5. Physical Books and Study Material",
      content: [
        "Physical books and study material supplied with a course are generally non-returnable and non-refundable once dispatched.",
        "Exceptions may be considered only in the following cases:",
        { type: "list" as const, items: ["Wrong item delivered","Item received in materially damaged condition","Item lost in transit and not delivered"] },
        "Reporting requirements (within 48 hours of delivery): order details; clear photographs or video, if available; and a description of the issue.",
        "Where Rodha accepts the claim, Rodha may, at its discretion, replace the item or issue a refund limited to the affected material/component. If physical material is part of a bundled course, dispatch of such material will also be treated as availing a component of the bundled product."
      ],
    },
    {
      id: "may-consider",
      title: "6. Cases Where Refund May Be Considered",
      content: [
        "Refunds may be considered only in limited situations such as:",
        { type: "list" as const, items: ["6.1 Duplicate Payment — If the learner is charged more than once for the same product due to a payment error, the duplicate amount may be refunded after verification.","6.2 Failed Transaction with Wrongful Debit — If the amount is debited from the learner's account but the order is not created and Rodha actually receives the amount, the amount may be refunded after reconciliation.","6.3 Non-Activation Due to Rodha-side Technical Failure — If the learner has successfully paid but Rodha fails to provide access within a reasonable time despite the learner reporting the issue through official support channels, Rodha may either activate access, or issue refund if the access failure is not resolved within a reasonable period.","6.4 Product Cancellation by Rodha Before Commencement — If Rodha cancels a product before its commencement and does not provide a reasonable substitute, equivalent transfer, or credit option, Rodha may issue an appropriate refund.","6.5 Material Non-Delivery or Material Service Failure Attributable to Rodha — If Rodha is unable to substantially deliver the purchased product for reasons attributable to Rodha and is unable to provide a reasonable alternative, extension, replacement access, or corrective resolution, Rodha may evaluate an appropriate remedy, which may include credit, extension, transfer, or refund, depending on the facts."] }
      ],
    },
    {
      id: "not-granted",
      title: "7. Situations Where Refund Will Not Be Granted",
      content: [
        "Refund shall ordinarily not be granted in the following situations:",
        { type: "list" as const, items: ["Change of mind after purchase","Financial difficulty arising after purchase","Lack of time to continue","Preference for another course or institute","Dissatisfaction based on personal expectation after availing access","Inability to attend due to school, college, office, exam schedule, travel, health, or personal commitments","Exam postponement, rescheduling, or policy changes by third-party exam bodies","Low or minimal usage after access has already been granted","Selective use of only some parts of a bundle","Claim for refund of the unused validity period","Internet issues, device issues, app/browser issues, or local connectivity issues not attributable to Rodha","Suspension or removal due to violation of Rodha's academic, platform, or community rules","Any request based on a claim that the learner did not fully utilize the course despite having valid access"] }
      ],
    },
    {
      id: "goodwill",
      title: "8. Goodwill Support",
      content: [
        "In deserving cases, including documented hardship situations, Rodha may, purely as a matter of goodwill and without any legal obligation, consider alternatives such as:",
        { type: "list" as const, items: ["Batch transfer","Deferral to another batch","Access extension","Store credit","Replacement enrollment in a comparable product"] },
        "Any such support shall be entirely discretionary, fact-specific, and shall not create a precedent or recurring entitlement."
      ],
    },
    {
      id: "request-process",
      title: "9. Refund Request Process",
      content: [
        "All refund or cancellation-related requests must be sent through Rodha's official support channels with:",
        { type: "list" as const, items: ["Full name","Registered email address","Registered mobile number","Order ID / Transaction ID","Product name","Date of purchase","Reason for request","Relevant screenshots/documents, where applicable"] },
        "Rodha may ask for additional information for verification."
      ],
    },
    {
      id: "timelines",
      title: "10. Timelines for Raising Specific Issues",
      content: [
        { type: "list" as const, items: ["Duplicate payment / wrongful debit issues should be reported within 7 days of transaction.","Access activation issues should be reported within 7 days of purchase or immediately upon noticing the issue.","Physical material issues should be reported within 48 hours of delivery."] },
        "Delay in reporting may affect the ability to verify and process the claim."
      ],
    },
    {
      id: "mode-timeline",
      title: "11. Refund Mode and Timeline",
      content: [
        "Where a refund is approved, it shall ordinarily be processed to the original payment method or any other mode determined by Rodha as appropriate.",
        "Approved refunds are typically processed within 7 to 15 business days, subject to payment gateway, bank, UPI, card network, or platform timelines.",
        "Rodha may deduct actual and reasonable charges where applicable, including payment gateway / payment processor charges, shipping charges, reverse logistics charges, value of used or dispatched components, and taxes or platform deductions where non-recoverable.",
        "No such deduction should apply in case of duplicate collection, wrongful debit without order creation, or Rodha-side cancellation before commencement."
      ],
    },
    {
      id: "chargebacks",
      title: "12. Chargebacks and Payment Disputes",
      content: [
        "Before initiating a chargeback, the learner is requested to first contact Rodha support and provide a reasonable opportunity to resolve the issue.",
        "If a chargeback or payment dispute is initiated despite valid access already being provided, Rodha reserves the right to suspend further access during the pendency of the payment dispute, subject to applicable law."
      ],
    },
    {
      id: "product-specific",
      title: "13. Communication of Product-Specific Terms",
      content: [
        "Where a specific product page contains additional or stricter refund/cancellation terms, those terms shall also apply, provided they are clearly disclosed before purchase.",
        "In case of conflict, the more specific product-level term shall prevail for that product, subject to applicable law."
      ],
    },
    {
      id: "consumer-rights",
      title: "14. No Waiver of Mandatory Consumer Rights",
      content: [
        "Nothing in this Policy is intended to exclude or restrict any mandatory consumer rights available under applicable law."
      ],
    },
    {
      id: "updates",
      title: "15. Policy Updates",
      content: [
        "Rodha may update this Policy from time to time. The version published on the official website on the date of purchase shall ordinarily apply to that purchase, unless a change is required by law."
      ],
    }
  ],
};

export const DISCLAIMER: LegalPageContent = {
  slug: "disclaimer",
  title: "Disclaimer",
  lastUpdated: "August 2026",
  description: "Important disclaimers regarding Rodha's educational content, exam preparation information, outcomes, and third-party platforms.",
  sections: [
    {
      id: "general",
      title: "1. General Platform Disclaimer",
      content: [
        "The Rodha Platform is provided to you \"as is\" and \"as available\" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, Rodha Educational Services Private Limited and its affiliates expressly disclaim all warranties, whether express, implied, statutory or otherwise, with respect to the Platform, including implied warranties of merchantability, fitness for a particular purpose, title and non-infringement.",
        "Rodha makes no representation or warranty that the Platform or the services or products offered therein will meet your requirements, achieve any intended results, operate without interruption, meet any performance or reliability standards, or be error free.",
        "This page summarises key disclaimer themes from Rodha's Terms of Use and product context. It is provided for clarity on the marketing website and does not replace the full Terms of Use or Refund Policy. Legal review of this page is recommended before treating it as definitive policy."
      ],
    },
    {
      id: "educational-content",
      title: "2. Educational and Exam Preparation Content",
      content: [
        "Course materials, blogs, sample questions, strategy guides, notifications summaries, and other educational content on the Rodha website are provided for general educational and informational purposes to support competitive exam preparation.",
        "They are not a substitute for official notifications, syllabi, eligibility rules, application instructions, or results published by exam conducting bodies (including but not limited to IIMs/CAT authorities, IPMAT conducting institutes, CLAT Consortium / NLUs, SSC, and other government or university bodies). Always verify dates, eligibility, fees, and syllabus from official sources before acting.",
        "Rodha may update marketing or blog content from time to time; content may contain errors or become outdated."
      ],
    },
    {
      id: "results-outcomes",
      title: "3. Results, Selections and Student Outcomes",
      content: [
        "Past student results, percentiles, ranks, testimonials, selection counts, and similar outcome claims shown on the website are individual historical outcomes. They do not guarantee similar results for any future student.",
        "Exam performance depends on personal effort, consistency, aptitude, exam difficulty, competition, and other factors outside Rodha's control. No mentor, course, mock score, or marketing statement should be treated as a promise of admission, selection, rank, or percentile."
      ],
    },
    {
      id: "course-information",
      title: "4. Course Information, Batches, Fees and Access",
      content: [
        "Course titles, batch dates, faculty assignments, inclusions, validity periods, prices, and promotional offers may change. The product page and checkout terms applicable at the time of purchase prevail for that enrollment.",
        "Access to live classes, recordings, mocks, and materials may be delivered through Rodha and/or partner platforms. Availability can be affected by maintenance, technical issues, or third-party platform outages."
      ],
    },
    {
      id: "external-platforms",
      title: "5. External Links and Partner Platforms",
      content: [
        "The website may redirect you to third-party platforms (including Graphy, ThinkExam, Rodha Buddy, payment gateways, and social media) for learning, testing, login, payments, or communication. Rodha does not control those platforms' availability, privacy practices, or terms beyond contractual relationships with them.",
        "Inclusion of any link does not imply endorsement. Use of any linked website or partner service is at your own risk and subject to that third party's terms and policies."
      ],
    },
    {
      id: "limitation",
      title: "6. Limitation of Liability",
      content: [
        "To the maximum extent permitted by law, Rodha shall not be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Content or any other materials on the Platform, even if Rodha has been notified of the possibility of such damage.",
        "Nothing in this Disclaimer is intended to exclude or restrict any mandatory consumer rights available under applicable law."
      ],
    },
    {
      id: "contact",
      title: "7. Contact",
      content: [
        "For questions about this Disclaimer, the Terms of Use, or related policies, write to raviprakash@rodha.co.in. Related pages: Privacy Policy (/privacy-policy), Terms of Use (/terms-and-conditions), and Refund Policy (/refund-policy)."
      ],
    }
  ],
};

export const LEGAL_PAGES = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_AND_CONDITIONS,
  refund: REFUND_POLICY,
  disclaimer: DISCLAIMER,
} as const;
