import { LoginForm } from "@/components/layouts/login_form";
import { LogIn } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <LogIn className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500">Enter your details to sign in</p>
          </div>
          <LoginForm />
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-indigo-600 to-purple-600 -z-10 rounded-b-[100px] opacity-10"></div>
      </div>
    </div>
  );
}

export default App;
