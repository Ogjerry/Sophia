export default function Footer() {
  return (
    <footer className="mx-auto container p-4">
      <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-300 py-6 md:grid-cols-2">
        <p className="text-sm">Copyright &copy; 2024 Sophia's Path</p>
        <div className="flex justify-end">
          <a className="hover:text-slate-900 dark:hover:text-slate-400" href="https://github.com/Ogjerry/Sophia">Star us on GitHub</a>
        </div>
      </div>
    </footer>
  );
}
