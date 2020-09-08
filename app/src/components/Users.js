import React, { useState, useEffect } from "react";
import axios from "axios";

const SERVER = process.env.REACT_APP_SERVER;

const Users = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(
        `${SERVER}/user/${id}`,
        {
          name,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEditing(false);
    } else {
      await axios.post(
        `${SERVER}/user`,
        {
          name,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    await getUsers();
    setName("");
    setEmail("");
    setPassword("");
  };

  const getUsers = async () => {
    const response = await axios.get(`${SERVER}/users`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure want to delete it?")) {
      await axios.delete(`${SERVER}/user/${id}`);
      await getUsers();
    }
  };

  const updateUser = async (id) => {
    const response = await axios.get(`${SERVER}/user/${id}`);
    setName(response.data.name);
    setEmail(response.data.email);
    setPassword(response.data.password);
    setEditing(true);
    setId(id);
  };

  return (
    <div className="row">
      <div className="col-md-12 col-lg-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="password"
            />
          </div>
          <button className="btn btn-primary">
            {editing ? "Update" : "Create"}
          </button>
        </form>
      </div>
      <div className="col-md-12 col-lg-8">
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <th>{user.name}</th>
                <th>{user.email}</th>
                <th>{user.password}</th>
                <th className="d-flex">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => updateUser(user._id)}
                  >
                    Update
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
