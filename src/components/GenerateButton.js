export default function GenerateButton({ onClick, isLoading = false }) {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`px-8 py-3 bg-green-600 text-white text-base font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {isLoading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  )
}
