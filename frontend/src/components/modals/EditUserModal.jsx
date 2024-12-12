//importing neccessary libraries for this modal which will edit users in the database and we will be using this as a functional component for table
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

//starting of the functional component which edits the user in the database
function EditUserModal() {
  //using state variables for access of the input fields
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  //function for dynamic change of values for the input fields of id field
  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  //function for dynamic change of values for the input fields of name field
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  //function for dynamic change of values for the input fields of email field
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };


  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  //creation of an async await function which first checks if all the inputs are filled, sends a post request to the server using axios then shows a toast message if is successful or not
  const handleEditUser = async () => {
    //input check
    if (!id || !name || !email || !phone || !password || !role || id==="" ||name === "" || email === ""  || phone === "" || password === "" || role === "") {
      toast.error("All Fields Are Required");
      return;
    }
    try {
      //put req to server
      const res = await axios.put(`http://localhost:3000`, {
        id,
        name,
        email,
        phone,
        password,
        role
      });

      //incase of success
      if (res.status === 200) {
        toast.success("User Edited || Reloading to Update");
        setId(""); //empty the fields after successful operation
        setName(""); //empty the fields after successful operation
        setEmail(""); //empty the fields after successful operation

        //after 3 sec reload the page for users to view edit
        setTimeout(() => {
          location.reload();
        }, 3000);

      }
    } catch (error) {
      //incase of error
      console.error("Error Editing User", error);
      toast.error("Error Editing User");
    }
  };
//using bootstrap pre built components
  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-bs-toggle="modal"
        id="button"
        data-bs-target="#editUserModal"
      >
        <b>Edit User</b>
      </button>

      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="EditUserModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="EditUserModal">
                <b>Enter Id, Name, Email, password, Role, and Phone</b>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="id" className="form-label">
                  Id:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="id"
                  placeholder="Ex: 12"
                  value={id}
                  onChange={handleIdChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  New Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Ex: John Doe"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  New Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Ex: johndoe@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  New Phone:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Ex: 9211420420"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  New Role:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  placeholder="Ex: Admin"
                  value={role}
                  onChange={handleRoleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  New Password:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  placeholder="Ex: *******"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleEditUser}
                data-bs-dismiss="modal"
              >
                <b>Edit User</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//exporting the created function
export default EditUserModal;
