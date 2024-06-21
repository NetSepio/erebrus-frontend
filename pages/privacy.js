/* eslint-disable */

import React, { useState } from 'react';

const Privacy = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className='p-20 text-white'>
    <div className='text-lg text-gray-200 mt-10'>Last Revised: June 21st 2024</div>  
      <div className='text-5xl font-semibold mt-10 '>Erebrus Privacy Policy</div>
      <div className='text-lg text-gray-200 mt-10'>
      Effective Date: June 20th 2024 <br />
        <div className='text-3xl my-10 font-semibold'>1. Introduction</div>
        Welcome to Erebrus, a platform provided by NetSepio (referred to as "we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines the types of information we collect, how it is used, and how you can control your information within our application. This policy has been designed to comply with global privacy laws, including the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR), and other relevant data protection laws.

      </div>
      <div className='text-3xl font-semibold my-10'>2. Information We Collect</div>
      <div className='text-3xl font-semibold my-10'>2.1 Personal Information</div>
      <div className=''>
      We may collect the following personal information from you:<br/>
      <ul className='list-disc pl-5'>
        <li> Name</li>
        <li>Email address</li>
        <li>Location data</li>
        <li>Contact information such as email address, social media handles, phone number etc.</li>
        <li>Payment details (if applicable)</li>
        <li>Profile information such as username, name, email and password</li>

      </ul>
      </div>
      <div className='text-3xl font-semibold my-10'>2.2 Sensitive Personal Information</div>
      <div className=''>
      We may collect sensitive personal information only when it is necessary for providing our services and only with your explicit consent. This may include:<br/>
      <ul className='list-disc pl-5'>
        <li>Financial data (such as payment modes like wallet payment, payment gateway)</li>
        <li>Biometric data (if applicable, for security purposes)</li>
      </ul>
      </div>
      <div className='text-3xl font-semibold my-10'>2.3 Usage Data </div>
      <div>
      We collect information about how you access and use our app, including but not limited to:
      <ul className='list-disc pl-5'>
        <li>Device information (e.g., device model, operating system)
        </li>
        <li>Log data (e.g., IP addresses, timestamps)</li>
        <li>Usage patterns (e.g., features accessed, duration of use)</li>
        
      </ul>
      </div>
      <div className='text-3xl font-semibold my-10'>2.4 Cookies and Tracking Technologies</div>
      <div>
      We use cookies and similar tracking technologies to monitor activity on our app and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.<br/>
      </div>
      <div className='text-3xl font-semibold my-10'>3. How We Use Your Information</div>
      <div className='text-3xl font-semibold my-10'>3.1 Personal Information</div>
      <div className=' text-justify'>
      We use your personal information to:
      <ul className='list-disc pl-5'>
        <li>Provide and improve our services</li>
        <li>Respond to your inquiries and feedback</li>
        <li> Send administrative information (e.g., updates, security alerts)</li>
        <li>Process transactions and send updates about your order</li>

      </ul>
      </div>
      <div className='text-3xl font-semibold my-10'>3.2 Usage Data</div>
      <div className='text-justify'>
      We use usage data to:<br/>
      <ul className='list-disc pl-5'>
        <li>Analyze and understand user behavior</li>
        <li>Improve the functionality and user experience of our app</li>
        <li>Monitor and prevent security threats</li>
      </ul>
         </div>
      <div className='text-3xl font-semibold my-10'>3.3 Marketing and Promotions</div>
      <div className='text-justify'>
      With your explicit consent, we may use your personal information to send you notifications, marketing and promotional communications. You can opt-out of these communications at any time.   </div>
    
    
    
      <div className='text-3xl font-semibold my-10'>4. How We Share Your Information</div>
      <div className='text-3xl font-semibold my-10'>4.1 Third-Party Service Providers</div>
      <div>
      We may share your information with third-party service providers to perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
      </div>
      {showMore && (
        <div>
          <div className='text-3xl font-semibold my-10'>4.2 Business Transfers</div>
          <div className='mt-10'>In the event of a merger, acquisition, or sale of all or a portion of our assets, your personal information may be transferred to the acquiring entity.</div>
          <div className='text-3xl font-semibold mt-10'>4.3 Compliance with Legal Obligations </div>
         
          <div className=' text-gray-200 mt-10'>
          We may disclose your personal information to law enforcement, regulatory authorities, or other relevant third parties in response to a valid legal request, or if we believe it is necessary to protect the safety, rights, or property of Erebrus, our users, or the public.
          </div>
          <div className='text-3xl font-semibold mt-10'>5. Data Protection Rights Under GDPR</div>
          <div className='text-lg text-gray-200 mt-10'>
          If you are a resident of the European Economic Area (EEA), you have the following data protection rights under the General Data Protection Regulation (GDPR):<br/>
          <br/><ul className='list-disc pl-5'>
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
            </li>
      <li>The right to erasure – You have the right to request the deletion of your personal data under certain conditions.</li>
      <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data under certain conditions.</li>
      <li>The right to object to processing – You have the right to object to the processing of your personal data under certain conditions.</li>
      <li>The right to data portability – You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
    

          </ul>
          <br/>
          To exercise any of these rights, please contact us at support@netsepio.com.
          </div>
          <div className='text-3xl font-semibold mt-10'>6. California Consumer Privacy Act (CCPA)</div>
          
          <div className='mt-10'>If you are a resident of California, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA):<br/>
          <br/><ul className='list-disc pl-5'>
<li>The right to know – You have the right to request that we disclose certain information to you about our collection and use of your personal data over the past 12 months.</li>
<li>The right to delete – You have the right to request that we delete any of your personal data that we collected from you and retained, subject to certain exceptions.</li>
<li>The right to opt-out of the sale of personal information – You have the right to request that your personal data not be sold to third parties.</li>
<li>The right to non-discrimination – You have the right to not be discriminated against for exercising any of your CCPA rights.</li>
</ul> 
<br/>
To exercise any of these rights, please contact us at support@netsepio.com.</div>

<div className='text-3xl  mt-10 '>7. Data Security</div>
<div className='mt-10'> We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. These measures include:<br/><br/>

<ul className='list-disc pl-5'>
  <li>Encryption of data in transit and at rest</li>
  <li>Regular security audits and assessments</li>
  <li>Access controls to restrict access to your information to authorized personnel only</li>
  <li>Implementation of secure coding practices</li>
</ul>
<br/>
However, no method of transmission over the Internet or method of electronic storage is 100% secure.

</div>
<div className='text-3xl font-semibold  mt-10 '>8. Data Retention</div>
<div className='mt-10 text-justify'> We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, as well as to comply with legal, accounting, or reporting requirements. When your information is no longer necessary, we will securely delete or anonymize it.<br/>
</div>

<div className='text-3xl font-semibold  mt-10 '>9. Your Privacy Rights</div>
<div className='mt-10'>
You have the right to:<br/> <br/>
  <ul className='list-disc pl-5'>

<li>Access the personal information we hold about you</li>

<li>Request the correction of inaccurate personal information</li>

<li>Request the deletion of your personal information</li>

<li>Object to the processing of your personal information</li>

<li> Request the restriction of processing your personal information</li>

<li>Request the transfer of your personal information to another party</li>

  </ul>
  <br/>
  To exercise any of these rights, please contact us at support@netsepio.com.

   </div>
   <div className='text-3xl font-semibold  mt-10 '>10. Children's Privacy</div>
   <div className='mt-10'>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.<br/><br/>
 </div>


<div className='text-3xl font-semibold  mt-10 '>11. Changes to This Privacy Policy</div>
<div className='mt-10'> We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with a new effective date. You are advised to review this Privacy Policy periodically for any changes.</div>



<div className='text-3xl font-semibold  mt-10 '>12. Contact Us</div>
<div className='mt-10'> If you have any questions or concerns about this Privacy Policy, please contact us at: <br/> <br/>
  <ul className='list-disc pl-5'>
    <li>Email: support@netsepio.com </li>
    <li>Mailing Address: </li>
    </ul>
   <div className='pl-20'> Lazarus Network Inc.<br/>
2209 SW 58th Way<br/>
West Park, Florida 33023<br/>
</div>
</div>
          

<div className='text-3xl font-semibold  mt-10 '>13. Legal Disclosures</div>

<div className='mt-10'> We may disclose your personal information to law enforcement, regulatory authorities, or other relevant third parties in response to a valid legal request, or if we believe it is necessary to protect the safety, rights, or property of Erebrus, our users, or the public.</div>


<div className='text-3xl font-semibold  mt-10'>14. Third-Party Links </div>
<div className='mt-10'>Our app may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these third-party websites or services. We recommend reviewing the privacy policy of any third-party website you visit. </div>

<div className='text-3xl font-semibold  mt-10'>15. Cookies and Tracking Technologies </div>
<div className='mt-10'>We use cookies and similar tracking technologies to monitor activity on our app and store certain information. You can instruct your device to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our app.

   </div>




   <div className='text-3xl font-semibold  mt-10'>16. International Data Transfer</div>
   <div className='mt-10'>Your information, including personal data, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. By using our app, you consent to the transfer of your information to such jurisdictions. </div>



<div className='text-3xl font-semibold  mt-10'>17. Data Minimization</div>
<div className='mt-10'>We only collect the information that is necessary for the purpose for which it is being collected. We do not collect excessive or irrelevant information. Our goal is to minimize the amount of personal data we hold to reduce the risk of data breaches.<br/><br/>
 </div>


<div className='text-3xl font-semibold  mt-10'>18. User-Generated Content</div>
<div className='mt-10'>If you post, upload, or otherwise make available any content on our app, you are responsible for ensuring that such content does not infringe on any third-party rights. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute such content. </div>




<div className='text-3xl font-semibold  mt-10'>19. Financial Information and Payment Processing</div>

<div className='mt-10'>If you make a purchase within our app, we may collect financial information, such as your payment mode and/or billing address. This information is collected solely for the purpose of processing your order. We use third-party payment processors that adhere to the latest security standards to handle your payment information securely. </div>



<div className='text-3xl font-semibold  mt-10'>20. Biometric Information</div>
<div className='mt-10'>If applicable, we may collect biometric information, such as fingerprints or facial recognition data, for authentication and security purposes. This information will only be collected with your explicit consent and will be securely stored and used solely for the purpose for which it was collected.</div>



<div className='text-3xl font-semibold  mt-10'>21. Data Breach Notification</div>
<div className='mt-10'>
In the unfortunate event of a data breach, we will promptly notify you and the relevant authorities as required by applicable law. Our notification will include information on the nature of the breach, the impacted data, and the steps we are taking to address and mitigate the effects of the breach.
</div>



<div className='text-3xl font-semibold  mt-10'>22. Do Not Track Signals</div>
<div className='mt-10'>
Our app does not respond to Do Not Track (DNT) signals. We do not track your online activity over time and across third-party websites. However, third-party websites you interact with may track your browsing activities. Please review the privacy policies of those websites for more information.</div>

<div className='text-3xl font-semibold  mt-10'>23. Contact Us</div>
<div className='mt-10'>
IIf you have any questions about this Privacy Policy, please contact us at:
<ul className='list-disc pl-5'> <br/>
  <li>Email: support@netsepio.com</li>
  <br/>
  </ul>
  <span>
  We are committed to protecting your privacy and ensuring that your experience with Erebrus is secure and reliable.<br/><br/>
---<br/><br/>
End User License Agreement (EULA)<br/><br/>
By using Erebrus, you also agree to the terms of our End User License Agreement (EULA), which outlines the terms and conditions for using our services in https://erebrus.io/terms.html.<br/><br/>
---<br/><br/>
Thank you for choosing Erebrus. Your privacy and trust are our top priorities as we strive to create a safer and more secure decentralized internet.<br/><br/>

    
    </span></div>


    <div className='text-lg text-gray-200 mt-10'>
    Effective Date: June 20th 2024 <br />
    </div>

        </div>
      )}
      <div className='flex flex-col items-end mt-10'>
        <button
          onClick={() => setShowMore(!showMore)}
          className='text-blue-500 hover:underline mb-4'>
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
};

export default Privacy;
