import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/pages/styles/Home.module.css';
import Swal from 'sweetalert2';


const Home = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(()=>{
    console.log("usersData =>", usersData);
  },[usersData])

  const loadUsersHandler = async () => {
    const res = await fetch('/api/users');
    const parsedData = await res.json();
    setUsersData(parsedData.data);
  };

  // Handle Add User
  const handleAddUser = async () => {
    const {value : formValues} = await Swal.fire({
      title: 'Add New User',
      html: `
      <form>
        <input 
          type="text" 
          id="username"
          name="username"
          class="swal2-input" 
          placeholder="Name"
        >
        <input 
          type="email" 
          id="email"
          name="email" 
          class="swal2-input" 
          placeholder="Email"
        >
        <input 
          type="password" 
          id="password" 
          name="password"
          class="swal2-input" 
          placeholder="Password"
        >
      </form>
      `,
      confirmButtonText: 'Add User',
      showCancelButton: true,
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const email = Swal.getPopup().querySelector('#email').value;
        const password = Swal.getPopup().querySelector('#password').value;

        if (!username || !email || !password) {
          Swal.showValidationMessage('Please fill out all fields');
          return null;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage('Please enter a valid email');
          return null;
        }

        return { username, email, password };
      },
    })
    // .then(result => {
    //   if (result.isConfirmed) {
       
    //   }
    // });

    if(formValues){
      // console.log(JSON.stringify(formValues));
      try {
        Swal.fire({
          title: "Please wait...",
          text: "Submitting your data...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });
  
        const data = await response.json();

        if (response.ok) {
          loadUsersHandler();
          Swal.fire("Success!", data.message || "Your data has been submitted.", "success");
        } else {
          Swal.fire("Error!", data.message || "Something went wrong.", "error");
        }
  
        // Swal.fire('Added!', `${result.value.name} has been added.`, 'success');
  
      } catch (error) {
        Swal.fire("Error!", "Unable to submit your data.", "error");
      }
    }
  };

  // Handle Delete Button Click
  const handleDelete = async id => {
     const user = usersData.find(x => String(x.id) === id)
    Swal.fire({
      title: `Delete ${user.username}?`,
      text: `Are you sure you want to delete this record?
      This operation cannot be reversed!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/users/${id}`,{method:"DELETE"});

          if(response.ok){
            loadUsersHandler();
            Swal.fire('Deleted!', `${user.username} has been removed.`, 'success');
          }else
            Swal.fire('There is a problem in delete operation',"...Oops!","error");
            
          } catch (error) {
            console.error("Problem in deleting data",error)
          Swal.fire('There is a problem in connecting to server',"...Oops!","error");
        }
      }
    });
  };

  // Handle Edit Button Click
  const handleEdit = async id => {
    const user = usersData.find(x=>String(x.id) === id);
    console.log('user => ',user);
    
    const {value : formvalues} = await Swal.fire({
      title: `Edit ${user.username}`,
      html: `
      <form>
        <input 
          type="text" 
          id="swal-username"
          name="username"
          class="swal2-input" 
          placeholder="Name"
        >
        <input 
          type="email" 
          id="swal-email"
          name="email" 
          class="swal2-input" 
          placeholder="Email"
        >
        <input 
          type="password" 
          id="swal-password"
          name="password"
          class="swal2-input" 
          placeholder="Password"
        >
      </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm:()=>{
        const username = document.getElementById("swal-username").value;
        const email = document.getElementById("swal-email").value;
        const password = document.getElementById("swal-password").value;

        if (!username || !email || !password)
          Swal.showValidationMessage("Please fill all fields !!!");
        else if (!/\S+@\S+\.\S+/.test(email))
          Swal.showValidationMessage('Please enter valid email');
       
        return {username,email,password}
      }
    });
    if(formvalues){
      try {
        console.log('formvalues =>', formvalues)
        const response = await fetch(`api/users/${id}`,{
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            id:id,
            username:formvalues.username,
            email:formvalues.email,
            password:formvalues.password
          })
        });
        console.log('response => ', response.json());
        
        if(response.ok){
          loadUsersHandler();
          Swal.fire("user informations updated successfully :)","Saved","success");
        }
        else
          Swal.fire('There is a problem in storing data',"Error!","error");

        
      } catch (error) {
        console.error("Problem in saving data");
        Swal.fire('There is a problem in connecting to server', "...Oops!", "error")
      }
    }
  };

  return (
    <>

      <div className={styles.container}>
        <Head>
          <title>Simple Next.js App</title>
          <meta name="description" content="A simple Next.js app with HTML and CSS" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to Moji Next.js crud!</h1>
          <p className={styles.description}>
            Get started by editing <code className={styles.code}>pages/index.js</code>
          </p>
          <div className={styles.get_post_users}>
            <button onClick={loadUsersHandler} className={styles.userbtn}>Load Users</button>
            <button onClick={handleAddUser} className={styles.userbtn}>Add User</button>
          </div>
          <h1 className={styles.user_title}>Users:</h1>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td style={{ display: 'flex', justifyContent: "space-between" }}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(`${user.id}`)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(`${user.id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className={styles.table_footer}>
                  End of Data
                </td>
              </tr>
            </tfoot>
          </table>
        </main>
        <footer className={styles.footer}>
          <p>Powered by Next.js</p>
        </footer>
      </div>
    </>
  )
}

export default Home