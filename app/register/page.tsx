"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { saveToken } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await api("/register", "POST", { email, password });

    if (res.token) {
      saveToken(res.token);
      router.push("/dashboard");
    } else {
      alert(res.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}