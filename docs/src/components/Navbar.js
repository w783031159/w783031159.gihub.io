import { computed } from 'vue';

export default {
    template: `
        <nav class="bg-white shadow fixed w-full top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/" class="flex-shrink-0 flex items-center">
                            <span class="text-2xl font-bold text-gray-900">ShoeShow</span>
                        </router-link>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <router-link to="/" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" active-class="border-indigo-500 text-gray-900">
                                Browse
                            </router-link>
                            <router-link to="/admin" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" active-class="border-indigo-500 text-gray-900">
                                Admin
                            </router-link>
                        </div>
                    </div>
                    <div class="flex items-center">
                         <button class="p-2 rounded-full text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Search</span>
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `
}
