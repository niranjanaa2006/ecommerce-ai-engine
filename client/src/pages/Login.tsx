import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    console.log(response.data);

    alert("Login successful");

    localStorage.setItem(
      "token",
      response.data.token
    );

  } catch (error: any) {
    alert("Login failed");

    console.log("FULL ERROR =", error);
    console.log("RESPONSE =", error.response);
    console.log("DATA =", error.response?.data);
  }
};
  return (
    <div>
      <h1>Login Page</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;