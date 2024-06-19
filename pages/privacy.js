/* eslint-disable */

import React, { useState } from 'react';

const Privacy = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className='p-20 text-white'>
      <div className='text-3xl font-semibold'>Privacy Policy</div>
      <div className='text-lg text-gray-200 mt-10'>
        Last updated: June 18, 2024 <br />
        <div className='text-3xl my-10'>Introduction</div>
        Welcome to Erebrus, a decentralized Virtual Private Network (dVPN) protocol leveraging the Decentralized Physical Infrastructure Network (DePIN). This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our services. We are committed to safeguarding your privacy and ensuring that your personal data is protected.<br/><br/>
        By accessing or using Erebrus, you agree to the terms of this Privacy Policy and the accompanying End User License Agreement (EULA). If you do not agree with the terms, please do not use our services.
      </div>
      <div className='text-3xl font-semibold my-10'>1. Information We Collect</div>
      <div className=''>
        Erebrus only collects the following information from users:<br/><br/>
        - Email Address / Wallet Address: We collect your email or wallet address for account creation, communication, and support purposes.<br/><br/>
        We do not collect any other personal information, browsing data, or connection logs.
      </div>
      <div className='text-3xl font-semibold my-10'>2. Use of Information</div>
      <div className=''>
        The information collected is used solely for the following purposes:<br/><br/>
        - Account Management: Managing your account and ensuring access to our services.<br/>
        - Communication: Sending service-related notifications, updates, and responding to your inquiries or support requests.
      </div>
      <div className='text-3xl font-semibold my-10'>3. No Sale of Personal Data</div>
      <div>
        Erebrus does not sell, trade, or otherwise transfer your personal data to any third parties. We are committed to maintaining the highest standards of user privacy.
      </div>
      <div className='text-3xl font-semibold my-10'>4. Data Security</div>
      <div>
        We implement a variety of security measures to maintain the safety of your personal information. <br/>
        However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
      </div>
      <div className='text-3xl font-semibold my-10'>5. User Responsibilities and Indemnification</div>
      <div className=' text-justify'>
        By using Erebrus, you agree to indemnify, defend, and hold harmless Erebrus, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, and costs (including reasonable attorney’s fees) arising from or related to your use of our services, violation of this Privacy Policy, or infringement of any intellectual property or other rights of any person or entity.<br/><br/>
        Erebrus services are provided "as is" without any warranties or guarantees. We do not guarantee that our services will meet your requirements or that they will be uninterrupted, secure, or error-free.
      </div>
      <div className='text-3xl font-semibold my-10'>6. Jurisdiction</div>
      <div className='text-justify'>
        This Privacy Policy and the accompanying EULA shall be governed by and construed in accordance with the laws of the United States. Any disputes arising out of or relating to this Privacy Policy or the use of our services shall be resolved in the courts of competent jurisdiction in the USA.
      </div>
      <div className='text-3xl font-semibold my-10'>7. Changes to This Privacy Policy</div>
      <div className='text-justify'>
        We reserve the right to modify or update this Privacy Policy at any time. We will notify you of any changes by updating the effective date of this Privacy Policy and, when feasible, providing additional notice (e.g., sending an email notification or posting a notice on our website). Your continued use of Erebrus following the posting of changes constitutes your acceptance of such changes.
      </div>
      <div className='text-3xl font-semibold my-10'>8. Contact Us</div>
      <div>
        If you have any questions about this Privacy Policy, please contact us at:<br/><br/>
        <span className='text-xl font-bold '>- Email: support@netsepio.com</span><br/><br/>
        We are committed to protecting your privacy and ensuring that your experience with Erebrus is secure and reliable.<br/><br/>
        ---
        <span>End User License Agreement (EULA)<br/><br/>
        By using Erebrus, you also agree to the terms of our End User License Agreement (EULA), which outlines the terms and conditions for using our services in https://erebrus.io/terms.html.<br/><br/>
        ---<br/><br/>
        Thank you for choosing Erebrus. Your privacy and trust are our top priorities as we strive to create a safer and more secure decentralized internet.<br/><br/>
        Effective Date: June 16th 2024</span>
      </div>
      {showMore && (
        <div>
          <div className='mt-10'>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your 
information when You use the Service and tells You about Your privacy rights and how the law protects You.
We use Your Personal data to provide and improve the Service. By using the Service, You agree to the 
collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created 
with the help of the <span className='underline'>Privacy Policy Generator.</span> </div>
          <div className='text-3xl font-semibold mt-10'>Interpretation and Definitions</div>
          <div className='text-2xl font-semibold mt-10'>Interpretation</div>
          <div className='text-lg text-gray-200 mt-10'>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. 
The following definitions shall have the same meaning regardless of whether they appear in singular or 
in plural.
          </div>
          <div className='text-2xl font-semibold mt-10'>Definitions</div>
          <div className='text-lg text-gray-200 mt-10'>
          For the purposes of this Privacy Policy:<br/>
          <ul className='list-disc pl-5'>
            <li>Account means a unique account created for You to access our Service or parts of our Service.</li>
            <li>Affiliate means an entity that controls, is controlled by or is under common control with a party, where 
     "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote 
      for election of directors or other managing authority.</li>
      <li>Application refers to Erebrus, the software program provided by the Company</li>
      <li>Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Erebrus.</li>
      <li>Country refers to:USA</li>
      <li>Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
      <li>Personal Data is any information that relates to an identified or identifiable individual.</li>
      <li>Service refers to the Application</li>
      <li>Service Provider means any natural or legal person who processes the data on behalf of the Company. <br/>
      It refers to third-party companies or individuals employed by the Company to facilitate the Service, to 
      provide the Service on behalf of the Company, to perform services related to the Service or to assist the 
      Company in analyzing how the Service is used</li>
      <li>
Usage Data refers to data collected automatically, either generated by the use of the Service or from the 
     Service infrastructure itself (for example, the duration of a page visit).</li>
      <li>
You means the individual accessing or using the Service, or the company, or other legal entity on behalf 
      of which such individual is accessing or using the Service, as applicable.</li>
    

          </ul>
          </div>
          <div className='text-2xl font-semibold mt-10'>Collecting and Using Your Personal Data </div>
          <div className='text-2xl  mt-10'>Types of Data Collected </div> 
          <div className='text-2xl  mt-10 '>Personal Data</div>
          <div className='mt-10'>While using Our Service, We may ask You to provide Us with certain personally identifiable information that 
can be used to contact or identify You. Personally identifiable information may include, but is not limited to:<br/>
<ul className='list-disc pl-5'>
<li>Email address</li>
<li>Usage Data</li>
</ul> </div>

<div className='text-2xl  mt-10 '>Usage Data</div>
<div className='mt-10'> Usage Data is collected automatically when using the Service.
Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), 
browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the 
time spent on those pages, unique device identifiers and other diagnostic data.<br/><br/>

When You access the Service by or through a mobile device, We may collect certain information 
automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique 
ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser 
You use, unique device identifiers and other diagnostic data.<br/><br/>

We may also collect information that Your browser sends whenever You visit our Service or when You 
access the Service by or through a mobile device.</div>
<div className='text-2xl font-semibold  mt-10 '>Information Collected while Using the Application</div>
<div className='mt-10 text-justify'> While using Our Application, in order to provide features of Our Application, We may collect, with Your 
prior permission:<br/>
<ul className='list-disc pl-5 '>
  <li>Information regarding your location</li>
</ul>

We use this information to provide features of Our Service, to improve and customize Our Service. 
The information may be uploaded to the Company's servers and/or a Service Provider's server or it may 
be simply stored on Your device.You can enable or disable access to this information at any time, 
through Your Device settings.</div>

<div className='text-2xl font-semibold  mt-10 '>Use of Your Personal Data</div>
<div className='mt-10'>
The Company may use Personal Data for the following purposes:<br/>
  <ul className='list-disc pl-5'>

<li>To provide and maintain our Service, including to monitor the usage of our Service.</li>

<li>To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You 
provide can give You access to different functionalities of the Service that are available to You as a 
registered user</li>

<li>For the performance of a contract: the development, compliance and undertaking of the purchase 
contract for the products, items or services You have purchased or of any other contract with Us through 
the Service.</li>

<li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic 
communication, such as a mobile application's push notifications regarding updates or informative 
communications related to the functionalities, products or contracted services, including the security 
updates, when necessary or reasonable for their implementation.</li>

<li>To provide You with news, special offers and general information about other goods, services and events 
which we offer that are similar to those that you have already purchased or enquired about unless You have 
opted not to receive such information.</li>

<li>To manage Your requests: To attend and manage Your requests to Us.</li>

<li>For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, 
restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether 
as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held 
by Us about our Service users is among the assets transferred.</li>

<li>For other purposes: We may use Your information for other purposes, such as data analysis, identifying 
usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve 
our Service, products, services, marketing and your experience.</li>
We may share Your personal information in the following situations:<br/>
<li>With Service Providers: We may share Your personal information with Service Providers to monitor and 
analyze the use of our Service, to contact You.</li>

<li>For business transfers: We may share or transfer Your personal information in connection with, or during 
negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our 
business to another company</li>

<li>With Affiliates: We may share Your information with Our affiliates, in which case we will require those 
affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint 
venture partners or other companies that We control or that are under common control with Us.</li>


<li>With business partners: We may share Your information with Our business partners to offer You certain 
products, services or promotions.</li>

<li>With other users: when You share personal information or otherwise interact in the public areas with other 
users, such information may be viewed by all users and may be publicly distributed outside.</li>

<li>With Your consent: We may disclose Your personal information for any other purpose with Your consent.</li>

  </ul>

   </div>
   <div className='text-2xl font-semibold  mt-10 '>Retention of Your Personal Data</div>
   <div className='mt-10'>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this 
Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal 
obligations (for example, if we are required to retain your data to comply with applicable laws), resolve 
disputes, and enforce our legal agreements and policies.<br/><br/>

The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for 
a shorter period of time, except when this data is used to strengthen the security or to improve the 
functionality of Our Service, or We are legally obligated to retain this data for longer time periods. </div>


<div className='text-2xl font-semibold  mt-10 '>Transfer of Your Personal Data</div>
<div className='mt-10'> Your information, including Personal Data, is processed at the Company's operating offices and in any other 
places where the parties involved in the processing are located. It means that this information may be 
transferred to — and maintained on — computers located outside of Your state, province, country or other 
governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.<br/><br/>

Your consent to this Privacy Policy followed by Your submission of such information represents Your 
agreement to that transfer.<br/><br/>

The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in 
accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or 
a country unless there are adequate controls in place including the security of Your data and other 
personal information.</div>



<div className='text-2xl font-semibold  mt-10 '>Delete Your Personal Data</div>
<div className='mt-10'> You have the right to delete or request that We assist in deleting the Personal Data that We have collected 
about You.<br/><br/>

Our Service may give You the ability to delete certain information about You from within the Service.<br/><br/>
You may update, amend, or delete Your information at any time by signing in to Your Account, if you have 
one, and visiting the account settings section that allows you to manage Your personal information. You 
may also contact Us to request access to, correct, or delete any personal information that You have 
provided to Us.Please note, however, that We may need to retain certain information when we have a legal 
obligation or lawful basis to do so.

</div>
          

<div className='text-2xl font-semibold  mt-10 '>Disclosure of Your Personal Data</div>
<div className='text-xl font-semibold  mt-10'>Business Transactions </div>
<div className='mt-10'> If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. 
We will provide notice before Your Personal Data is transferred and becomes subject to a different 
Privacy Policy.</div>


<div className='text-xl font-semibold  mt-10'>Law enforcement </div>
<div className='mt-10'>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to 
do so by law or in response to valid requests by public authorities (e.g. a court or a government agency). </div>

<div className='text-xl font-semibold  mt-10'>Other legal requirements </div>
<div className='mt-10'>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:<br/>
<ul className='list-disc pl-5 mt-5'>
  <li>Comply with a legal obligation</li>
  <li>
  Protect and defend the rights or property of the Company</li>
  <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
  <li>Protect the personal safety of Users of the Service or the public</li> 
  <li>Protect against legal liability</li> 

</ul>

   </div>




   <div className='text-xl font-semibold  mt-10'>Security of Your Personal Data</div>
   <div className='mt-10'>The security of Your Personal Data is important to Us, but remember that no method of transmission over 
the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable 
means to protect Your Personal Data, We cannot guarantee its absolute security. </div>



<div className='text-2xl font-semibold  mt-10'>Children's Privacy</div>
<div className='mt-10'>Our Service does not address anyone under the age of 13. We do not knowingly collect personally 
identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware 
that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have 
collected Personal Data from anyone under the age of 13 without verification of parental consent, We take 
steps to remove that information from Our servers.<br/><br/>

If We need to rely on consent as a legal basis for 
processing Your information and Your country requires consent from a parent, We may require Your parent's 
consent before We collect and use that information. </div>


<div className='text-2xl font-semibold  mt-10'>Links to Other Websites</div>
<div>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, 
You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site 
You visit.<br/><br/>

We have no control over and assume no responsibility for the content, privacy policies or practices of any 
third party sites or services. </div>




<div className='text-2xl font-semibold  mt-10'>Changes to this Privacy Policy</div>

<div className='mt-10'>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new 
Privacy Policy on this page.<br/><br/>

We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming 
effective and update the "Last updated" date at the top of this Privacy Policy.<br/><br/>

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are 
effective when they are posted on this page. </div>



<div className='text-2xl font-semibold  mt-10'>Contact Us</div>
<div className='mt-10'>If you have any questions about this Privacy Policy, You can contact us:<br/>
<ul className='list-disc pl-5'>
  <li>By email: support@netsepio.com  </li>
 </ul></div>

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
