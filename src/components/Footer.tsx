export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 border-t border-red-200/30 dark:border-red-800/30">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            <span className="text-lg">🎄</span>
            <span>
              Made with <span className="text-red-500 dark:text-red-400">❤️</span> by{' '}
              <span className="font-semibold text-red-600 dark:text-red-400">Jessica</span>
            </span>
            <span className="text-lg">🎄</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Merry Christmas! 🎅✨
          </p>
        </div>
      </div>
    </footer>
  );
}

