// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";

// import { loginUser } from "../../api/authApi";
// import useAuthStore  from "../../store/authStore";

// const LoginForm = () => {
//   const navigate = useNavigate();

//   const login = useAuthStore((state) => state.login);

//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const response = await loginUser(data);

//       login(response.user, response.token);

//       toast.success("Login successful");

//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.detail ||
//           "Invalid email or password"
//       );
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-5"
//     >
//       {/* Email */}
//       <div>
//         <label className="block mb-2 font-medium">
//           Email
//         </label>

//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
//           {...register("email", {
//             required: "Email is required",
//           })}
//         />

//         {errors.email && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.email.message}
//           </p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <label className="block mb-2 font-medium">
//           Password
//         </label>

//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             className="w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500"
//             {...register("password", {
//               required: "Password is required",
//             })}
//           />

//           <button
//             type="button"
//             onClick={() =>
//               setShowPassword(!showPassword)
//             }
//             className="absolute right-3 top-3"
//           >
//             {showPassword ? (
//               <EyeOff size={20} />
//             ) : (
//               <Eye size={20} />
//             )}
//           </button>
//         </div>

//         {errors.password && (
//           <p className="text-red-500 text-sm mt-1">
//             {errors.password.message}
//           </p>
//         )}
//       </div>

//       {/* Forgot Password */}
//       <div className="text-right">
//         <Link
//           to="/forgot-password"
//           className="text-blue-600 hover:underline text-sm"
//         >
//           Forgot Password?
//         </Link>
//       </div>

//       {/* Login Button */}
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
//       >
//         {isSubmitting ? "Signing In..." : "Sign In"}
//       </button>

//       {/* Register */}
//       <div className="text-center text-sm">
//         Don't have an account?{" "}
//         <Link
//           to="/register"
//           className="text-blue-600 hover:underline"
//         >
//           Register
//         </Link>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;


import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthStore from "../../store/authStore";

const LoginForm = () => {
  const navigate = useNavigate();

  const { login, loading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Loan Management
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border rounded-lg px-4 py-3"
              {...register("email")}
            />

          </div>

          <div>

            <label className="block mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border rounded-lg px-4 py-3"
              {...register("password")}
            />

          </div>

          {error && (

            <p className="text-red-600">
              {error}
            </p>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default LoginForm;