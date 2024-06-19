import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Terms = () => {

    const topics = [
        { id: 1, name: "Introduction", description: `Welcome to Erebrus, A decentralized VPN (dVPN) protocol leveraging the Decentralized Physical Infrastructure Network (DePIN). By using Erebrus ("Service"), you agree to comply with and be bound by the following End User License Agreement ("EULA"). Please read this agreement carefully before using our Service.` },
        { id: 2, name: "Acceptance of Terms", description: `By accessing or using Erebrus, you agree to be bound by this EULA. If you do 
not agree to these terms, do not use our Service.
` },
        { id: 3, name: "Service Description", description: `Erebrus is a dVPN protocol designed to enhance user privacy, security, and 
transparency by decentralizing internet access. Our Service does not 
guarantee any specific results, performance, or security outcomes, and is 
provided "as is."` },
        { id: 4, name: "Use of Service", description: `You may use Erebrus for lawful purposes only. You agree not to use the 
Service for any illegal activities or in a manner that could harm the integrity, 
security, or availability of the Service.` },
        { id: 5, name: "User Information", description: `We respect your privacy and are committed to protecting it. The only user 
information we collect is your email address, which will be handled in 
accordance with our Privacy Policy. We do not sell, track, or share your data 
with third parties.` },
        { id: 6, name: "Privacy Policy", description: `By using Erebrus, you agree to the collection and use of information in 
accordance with our Privacy Policy. Our Privacy Policy is available on our 
website <a href="https://erebrus.io/" target="_blank" rel="noopener noreferrer" style="color: black; text-decoration: underline;"><strong>here</strong></a> and is incorporated into this EULA by reference.` },
        { id: 7, name: "No Warranties", description: `Erebrus is provided "as is" without any warranties of any kind, whether 
express, implied, or statutory. We do not guarantee that the Service will be 
uninterrupted, error-free, or free from viruses or other harmful components. 
We disclaim any warranties of merchantability, fitness for a particular 
purpose, and non-infringement.` },
        { id: 8, name: "Limitation of Liability", description: `To the maximum extent permitted by law, Erebrus, its affiliates, and its 
licensors shall not be liable for any indirect, incidental, special, consequential, 
or punitive damages, or any loss of profits or revenues, whether incurred 
directly or indirectly, or any loss of data, use, goodwill, or other intangible 
losses, resulting from: 
- Your use of or inability to use the Service
- Any unauthorized access to or use of our servers
- Any bugs, viruses, or other harmful code that may be transmitted to or  through our Service` },
        { id: 9, name: "Indemnification", description: `You agree to indemnify, defend, and hold harmless Erebrus, its affiliates, and 
its licensors, and their respective officers, directors, employees, and agents 
from and against any claims, liabilities, damages, losses, and expenses, 
including reasonable attorney's fees and costs, arising out of or in any way 
connected with:
- Your access to or use of the Service
- Your violation of any term of this EULA
- Your violation of any third-party right, including without limitation any 
intellectual property, property, or privacy right
` },
        { id: 10, name: "Governing Law", description: `This EULA and any dispute arising out of or in connection with it shall be 
governed by and construed in accordance with the laws of the United States. 
Any legal action or proceeding related to this EULA shall be brought 
exclusively in the courts located within the United States.` },
        { id: 11, name: "Changes to this EULA", description: `We reserve the right to modify this EULA at any time. Any changes will be 
posted on our website, and your continued use of the Service after such 
changes have been posted constitutes your acceptance of the new EULA.` },
        { id: 12, name: "Termination", description: `We reserve the right to terminate your access to the Service at our sole 
discretion, without notice, for conduct that we believe violates this EULA or is 
harmful to other users of the Service, us, or third parties, or for any other reason.` },
        { id: 13, name: "Contact Information", description: `If you have any questions about this EULA or the Service, please contact us at 
support@netsepio.com.

By using Erebrus, you acknowledge that you have read, understood, and 
agree to be bound by this EULA.` },
      ];

      const [selectedTopic, setSelectedTopic] = useState(topics[0]);
      

  return (
    <div className="min-h-screen">
        <div className="text-white flex flex-col w-1/3 mx-auto mt-10">
           <div className="text-3xl font-semibold">Terms and Conditions</div>
           <div className="mt-4 text-md">End User License Agreement (EULA) for Erebrus 
           dVPN Protocol</div>
        </div>

        <div className="mt-10 mx-20 flex pb-10">
<div className="w-1/3 p-10" style={{backgroundColor:'#D9D9D9'}}>
<ul style={{ listStyle: 'none', padding: 0 }}>
          {topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                fontSize: '20px',
                borderRadius: '5px',
                // background: selectedTopic?.id === topic.id ? '#f0f0f0' : '#D9D9D9',
                color: selectedTopic?.id === topic.id ? '#0162FF' : '#6D6D6E',
              }}
            >
              {topic.id}. {topic.name}
            </li>
          ))}
        </ul>
</div>
<div className="w-2/3" style={{backgroundColor:'#5696FF'}}>
{/* {selectedTopic ? ( */}
          <div>
            <p className='text-white text-lg p-20' style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: selectedTopic?.description }}></p>
          </div>
        {/* ) : (
          <p>Select a topic to see the description</p>
        )} */}
</div>
        </div>
    </div>
  )
}

export default Terms;
