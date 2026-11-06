
export default function Search() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-red-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Quotation Generator Logo" className="h-10 rounded-md" />
          <span className="text-xl font-bold">Quotation Generator</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:underline text-[22px]">
                Raj Tiles
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 p-6 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full ">
        <h1>hello</h1>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        &copy; 2025 Quotation Generator. All Rights Reserved.
      </footer>
    </div>
  );
}
