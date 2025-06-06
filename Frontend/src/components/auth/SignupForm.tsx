import React, { useEffect, useState } from "react";
import { SignupData } from "../../types/auth";
import { signup } from "../../routes/authRoute"; // Assuming this is your signup API function
import { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignupForm = () => {
  useEffect(() => {
    document.body.classList.add("errormt");
    return () => {
      document.body.classList.remove("errormt");
    };
  }, []);

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    organisation_name: "",
    role: "User",
  });

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("All fields except Organisation Name are required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const responseData = await signup(formData);
      let success = responseData?.success;
      if(responseData){
        success = responseData?.success;
        if(success) {
          navigate("/ask-security-qn",{replace:true, state:{email:formData.email}});
        }
      }
      else{
        toast.error(responseData?.error,{duration:2000});
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const backendMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      setError(backendMessage);
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-purple-600 uppercase text-center">Sign Up</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nova"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="novadesigns@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder="********"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="organisation_name" className="block text-sm font-medium">
            Organisation Name (Optional)
          </label>
          <input
            type="text"
            id="organisation_name"
            name="organisation_name"
            placeholder="Nova Designs"
            value={formData.organisation_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline text-purple-700">
            Login
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-900 text-white p-2 rounded-md mt-4 transition-all"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
