import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{ backgroundImage: "url('/assets/Background.svg')" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32 max-w-6xl w-full relative">
        <div className="hidden md:flex relative items-center justify-center">
          <img
            src="/assets/Group 510.svg"
            className="w-[400px] h-auto"
          />
          <img
            src="/assets/iPhone 14 Pro.svg"
            className="absolute top-79 left-56 w-[250px] h-auto -translate-x-1/2 -translate-y-1/2 z-10"
          />
        </div>

        <div className="flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
