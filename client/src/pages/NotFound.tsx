import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full">
      <div className="bg-white min-h-full flex justify-center items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-Green sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6 mt-1">
              <div>
                <h1 className="text-4xl font-extrabold text-Black tracking-tight sm:text-4xl">
                  The page you{"'"}re looking for cannot be found :(
                </h1>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <button onClick={() => navigate("/")} className="green-button">
                  Going back to homepage?
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
