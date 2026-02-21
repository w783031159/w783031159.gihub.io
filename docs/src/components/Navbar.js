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
                        <router-link to="/" v-slot="{ href, navigate, isExactActive }">
                            <a
                                :href="href"
                                @click="navigate"
                                class="px-1 py-2 font-semibold uppercase tracking-widest transition-colors duration-300"
                                :class="isExactActive ? 'text-black text-lg sm:text-xl' : 'text-gray-400 text-xs'"
                            >
                                Home
                            </a>
                        </router-link>
                        <router-link to="/about" v-slot="{ href, navigate, isActive }">
                            <a
                                :href="href"
                                @click="navigate"
                                class="px-1 py-2 font-semibold uppercase tracking-widest transition-colors duration-300"
                                :class="isActive ? 'text-black text-lg sm:text-xl' : 'text-gray-400 text-xs'"
                            >
                                About Us
                            </a>
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>
    `
}
