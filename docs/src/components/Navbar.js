export default {
    template: `
        <nav class="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-gray-100 transition-all duration-300">
            <div class="max-w-7xl mx-auto px-6 lg:px-12">
                <div class="flex justify-between h-20">
                    <div class="flex items-center">
                        <router-link to="/" class="flex-shrink-0 flex items-center group">
                            <span class="text-xl sm:text-2xl font-bold tracking-[0.25em] text-black uppercase group-hover:text-gray-600 transition-colors">
                                K&amp;J Trading
                            </span>
                        </router-link>
                    </div>
                    <div class="hidden sm:flex sm:items-center sm:space-x-10">
                        <router-link
                            to="/"
                            class="text-gray-500 hover:text-black px-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                            active-class="text-black"
                            exact
                        >
                            Home
                        </router-link>
                        <router-link
                            to="/about"
                            class="text-gray-400 hover:text-black px-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                            active-class="text-black"
                        >
                            About Us
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>
    `
}
