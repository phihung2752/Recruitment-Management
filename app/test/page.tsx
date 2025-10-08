export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Test Page</h1>
        <p className="text-gray-600">If you can see this, the frontend is working!</p>
        <div className="mt-8">
          <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
        </div>
      </div>
    </div>
  )
}


