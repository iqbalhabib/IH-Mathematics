export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b px-6 py-4 flex items-center justify-between">
      <span className="font-bold text-xl text-blue-700">MathPro</span>
      <div className="flex gap-4 text-sm">
        <a href="/courses" className="hover:text-blue-600">Courses</a>
        <a href="/past-papers" className="hover:text-blue-600">Past Papers</a>
        <a href="/ai-solver" className="hover:text-blue-600">AI Solver</a>
        <a href="/login" className="hover:text-blue-600">Login</a>
      </div>
    </nav>
  );
}
