import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
          <div className="space-x-4">
            <Link
              href="/signin"
              className="px-6 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition duration-300 inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 shadow-lg inline-block"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center text-white py-20">
          <h2 className="text-5xl font-bold mb-6">
            Manage Your Tasks with Ease
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Simple, fast, and intuitive task management. Keep track of your
            daily tasks and boost your productivity.
          </p>
          <Link
            href="/signup"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300 inline-block shadow-xl"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-white mt-20">
          {/* Feature 1 */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Simple Tasks</h3>
            <p className="text-blue-100">
              Create and manage tasks with just a few clicks
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-blue-100">Your tasks are private and secure</p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-blue-100">
              Built with Next.js for lightning-fast performance
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-white/60 text-sm">
          <p>© 2024 TaskFlow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}