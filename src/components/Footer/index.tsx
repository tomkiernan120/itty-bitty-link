import Link from "next/link";

export default function Footer () {
    return <footer className="w-full bg-darkgreen-500">
        <div className="container px-8 md:mx-auto">
          <div className=" text-white inner flex flex-col text-center md:text-left space-y-3 md:space-y-0 md:flex-row justify-between items-center py-4">
            <p>
              Copyright &copy; Tom Kiernan {new Date().getFullYear()}
            </p>

            <p>
              Built By <Link className="font-semibold text-black" href="https://tomkiernan.co.uk">
                Tom Kiernan
              </Link>
            </p>
          </div>
        </div>
      </footer>;
}