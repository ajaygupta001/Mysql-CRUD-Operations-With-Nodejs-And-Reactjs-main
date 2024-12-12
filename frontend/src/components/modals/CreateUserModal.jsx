//importing neccessary libraries for this modal which will add users to the database and we will be using this as a functional component for table
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

//starting of the functional component which takes a argument inside for adding the user to the user aray for dynamic display witout any reload
function CreateUserModal({ addUser }) {
  //using state variables for access of the input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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
  const handleCreateUser = async () => {
    //input check
    if (!name || !email || !phone || !password || !role || name === "" || email === ""  || phone === "" || password === "" || role === "") {
      toast.error("All Fields Are Required");
      return;
    }

    try {
      //post req to server
      const res = await axios.post("http://localhost:3000/", {
        name,
        email,
        phone,
        password,
        role
      });

      //incase of success
      if (res.status === 201) {
        toast.success("User Created");
        addUser(res.data); // add the new user to the list
        setName(""); //empty the fields after successful operation
        setEmail(""); //empty the fields after successful operation
        setPassword(""); //empty the fields after successful operation
        setPhone(""); //empty the fields after successful operation
        setRole(""); //empty the fields after successful operation
      }
    } catch (error) {
      //incase of error
      console.error("Error Creating User: ", error);
      toast.error("Error Creating User");
    }
  };

  //using bootstrap pre built components
  return (
    <>
      <button
        type="button"
        className="btn btn-success"
        data-bs-toggle="modal"
        id="button"
        data-bs-target="#CreateUserModal"
      >
        <b>Create User</b>
      </button>

      <div
        className="modal fade"
        id="CreateUserModal"
        tabIndex="-1"
        aria-labelledby="CreateUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="CreateUserModalLabel">
                <b>Enter Name and Email</b>
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
                <label htmlFor="name" className="form-label">
                  Name:
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
                  Email:
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
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Ex: johndoe@123"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  phone:
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
                  Role:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  placeholder="Ex: 9211420420"
                  value={role}
                  onChange={handleRoleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleCreateUser}
                data-bs-dismiss="modal"
              >
                <b>Create User</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//exporting the created function
export default CreateUserModal;
