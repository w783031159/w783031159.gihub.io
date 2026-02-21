import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import store from '../store.js';

export default {
    template: `
        <div class="bg-white">
            <div v-if="loading" class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            
            <div v-else-if="!product" class="text-center py-20 text-gray-500">
                Product not found.
            </div>

            <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <!-- Back Button -->
                <div class="absolute top-12 left-4 lg:left-0 z-10 transform -translate-x-2 sm:-translate-x-4 lg:-translate-x-14">
                    <router-link to="/" class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors duration-200" aria-label="Back to Home">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </router-link>
                </div>

                <div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    <!-- Image Gallery -->
                    <div class="flex flex-col-reverse">
                        <!-- Image Selector -->
                        <div class="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                            <div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
                                <button 
                                    v-for="(img, idx) in product.images" 
                                    :key="idx" 
                                    @click="selectedImage = img"
                                    class="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                                    :class="{'ring-2 ring-indigo-500': selectedImage === img}"
                                >
                                    <span class="sr-only">Image {{ idx + 1 }}</span>
                                    <span class="absolute inset-0 rounded-md overflow-hidden">
                                        <img :src="img" alt="" class="w-full h-full object-center object-cover">
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div class="w-full aspect-w-1 aspect-h-1">
                            <img :src="selectedImage || (product.images && product.images[0])" alt="" class="w-full h-full object-center object-cover sm:rounded-lg">
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">{{ product.name }}</h1>

                        <!-- Description -->
                        <div class="mt-6">
                            <h3 class="sr-only">Description</h3>
                            <div class="text-base text-gray-700 space-y-6" v-html="product.description"></div>
                        </div>
                        
                        <!-- Attributes Table -->
                        <div class="mt-8 border-t border-gray-200 pt-8">
                            <h3 class="text-sm font-medium text-gray-900 mb-4">Specifications</h3>
                            <div class="border border-gray-200 rounded-md overflow-hidden">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-if="product.brand">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Brand</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.brand }}</td>
                                        </tr>
                                        <tr v-if="product.model">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Model</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.model }}</td>
                                        </tr>
                                        <tr v-if="product.color">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Color</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.color }}</td>
                                        </tr>
                                        <tr v-if="product.material">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Material</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.material }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Size Selector -->
                        <div class="mt-8">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-medium text-gray-900">Size</h3>
                            </div>

                            <div class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4">
                                <button 
                                    v-for="size in (product.sizes || [])" 
                                    :key="size"
                                    class="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer"
                                >
                                    {{ size }}
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const route = useRoute();
        const product = ref(null);
        const loading = ref(true);
        const selectedImage = ref(null);

        onMounted(async () => {
            const id = route.params.id;
            // Fetch single product or find in store
            // Ideally fetch fresh
            try {
                // Check store first for cache-like behavior
                const cached = store.products.find(p => p.id === id);
                if (cached) {
                    product.value = cached;
                    if (cached.images && cached.images.length > 0) {
                        selectedImage.value = cached.images[0];
                    }
                    loading.value = false;
                }
                
                // Fetch fresh
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    product.value = await res.json();
                    if (!selectedImage.value && product.value.images && product.value.images.length > 0) {
                        selectedImage.value = product.value.images[0];
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                loading.value = false;
            }
        });

        return {
            product,
            loading,
            selectedImage
        };
    }
}
