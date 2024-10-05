export default function SignUpForm() {
    return (
        <form className="mt-8">
            <div className="space-y-3">
                <div>
                    <label
                        className="mb-3 block font-medium text-white text-sm"
                        htmlFor="name"
                    >
                        Full Name
                    </label>
                    <input
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-black placeholder-gray-600 duration-200 focus:outline-none focus:ring-gray-600 sm:text-sm"
                        id="name"
                        placeholder="Your full name"
                        type="text"
                    />
                </div>
                <div>
                    <label
                        className="mb-3 block font-medium text-white text-sm"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-black placeholder-gray-600 duration-200 focus:outline-none focus:ring-gray-600 sm:text-sm"
                        id="email"
                        placeholder="Your email"
                        type="email"
                    />
                </div>
                <div className="col-span-full">
                    <label
                        className="mb-3 block font-medium text-white text-sm"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-black placeholder-gray-600 duration-200 focus:outline-none focus:ring-gray-600 sm:text-sm"
                        id="password"
                        placeholder="Create a password"
                        type="password"
                    />
                </div>
                <div className="col-span-full">
                    <button
                        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium text-black duration-200 hover:bg-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2"
                        type="submit"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </form>
    );
}