export default function BuyButton({ inputRef, isLoading = false, isUploaded = false }) {
  const triggerUpload = () => {
    if (!isLoading) inputRef?.current?.click()
  }

  const buttonLabel = isLoading
    ? 'Uploading...'
    : isUploaded
    ? 'Replace Image'
    : 'Upload Image'

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={triggerUpload}
        disabled={isLoading}
        className={`px-8 py-3 bg-primary text-white text-base font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {isLoading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {buttonLabel}
      </button>
      <p className="text-lg font-semibold text-black">$29</p>
    </div>
  )
}
