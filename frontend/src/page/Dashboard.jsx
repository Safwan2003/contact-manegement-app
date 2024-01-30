import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getuserdetails, getcontact, deletecontact, addcontact, editcontact } from './contact';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [contacts, setContacts] = useState([]);

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getuserdetails();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/auth');
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  const fetchContacts = async () => {
    try {
      const contactData = await getcontact();
      setContacts(contactData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  useEffect(() => {
    // Fetch contacts on component mount
    fetchContacts();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  const handleDeletecontact = async (contactId) => {
    try {
      const { value: confirmDelete } = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this contact item!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });
  
      if (confirmDelete) {
        // User clicked "Yes, delete it!" in the SweetAlert
        await deletecontact(contactId);
        await fetchContacts(); // Fetch updated contacts after deletion
  
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Contact item has been deleted.',
        });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error Deleting contact',
        text: 'There was an error deleting the contact item. Please try again later.',
      });
    }
  };
  

  const handleAddContact = async () => {
    try {
      const { value: formData } = await Swal.fire({
        title: 'Add Contact',
        html:
          '<input id="name" class="swal2-input" placeholder="Name">' +
          '<input id="email" class="swal2-input" placeholder="Email">' +
          '<input id="phone" class="swal2-input" placeholder="Phone">' +
          '<input id="relation" class="swal2-input" placeholder="Relation">',
        focusConfirm: false,
        preConfirm: () => {
          return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            relation: document.getElementById('relation').value,
          };
        },
      });

      if (formData) {
        await addcontact(formData);
        // Update contacts after addition
        const updatedContacts = [...contacts, formData];
        setContacts(updatedContacts);
        Swal.fire({
          icon: 'success',
          title: 'Contact Added',
          text: 'The contact has been added successfully!',
        });
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the contact. Please try again.',
      });
    }
  };

  const handleEditContact = async (contactId) => {
    try {
      const existingContact = contacts.find((contact) => contact._id === contactId);

      if (!existingContact) {
        console.error('Contact not found');
        return;
      }

      const { value: updatedFormData } = await Swal.fire({
        title: 'Edit Contact',
        html:
          `<input id="name" class="swal2-input" placeholder="Name" value="${existingContact.name}">` +
          `<input id="email" class="swal2-input" placeholder="Email" value="${existingContact.email}">` +
          `<input id="phone" class="swal2-input" placeholder="Phone" value="${existingContact.phone}">` +
          `<input id="relation" class="swal2-input" placeholder="Relation" value="${existingContact.relation}">`,
        focusConfirm: false,
        preConfirm: () => {
          return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            relation: document.getElementById('relation').value,
          };
        },
      });

      if (updatedFormData) {
        await editcontact(updatedFormData, contactId);
        // Update contacts after editing
        const updatedContacts = contacts.map((contact) =>
          contact._id === contactId ? { ...contact, ...updatedFormData } : contact
        );
        setContacts(updatedContacts);
        Swal.fire({
          icon: 'success',
          title: 'Contact Edited',
          text: 'The contact has been edited successfully!',
        });
      }
    } catch (error) {
      console.error('Error editing contact:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error editing the contact. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 mb-6">
        <div className="flex justify-between items-center px-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          {userDetails && userDetails.name && (
  <p className="font-bold">WELCOME! {userDetails.name}</p>
)}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white shadow-md p-8 rounded-md mx-8 bg-[url('./assets/2.jpg')] bg-no-repeat">
        
        <div className="mt-8">
          <h3 className="text-3xl  text-center font-semibold mb-4">Contacts</h3>
           <div className='flex justify-between px-[10rem]'><div className=''>search<input type='search' className='bg-red-500 p-2 px-3 rounded-lg' />
           </div>
          
          <button
            onClick={handleAddContact}
            className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-700 mb-4"
          >
            Add Contact
          </button></div>
          <ul className='grid grid-cols-3 gap-5 '>
            {contacts.map((contact) => (
              <li key={contact._id} className=" mb-4 border-b border-blue-300 pb-4">
                <div className="  shadow-2xl hover:shadow-blue-200 p-3 rounded-3xl" >
                  <div>
                    <p className="text-xl font-semibold">{contact.name}</p>
                    <p className="text-gray-700">{contact.email}</p>
                    <p className="text-gray-700">{contact.phone}</p>
                    <p className="text-gray-700">{contact.relation}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditContact(contact._id)}
                      className="text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletecontact(contact._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
