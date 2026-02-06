import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store.js';

export default {
    template: `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Filter / Sort Header -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">New Arrivals</h1>
                <div class="flex space-x-4 mt-4 sm:mt-0">
                    <select v-model="sortBy" class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="store.loading" class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="sortedProducts.length === 0" class="text-center py-20 text-gray-500">
                No products found.
            </div>

            <!-- Product Grid -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="product in sortedProducts" :key="product.id" class="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                    <!-- Image -->
                    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative">
                        <img 
                            :src="product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x300?text=No+Image'" 
                            :alt="product.name"
                            class="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                            loading="lazy"
                        >
                        
                        <!-- Quick View Overlay -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-10">
                            <button @click.prevent="goToDetail(product.id)" class="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                                View Details
                            </button>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="p-4 cursor-pointer" @click="goToDetail(product.id)">
                        <h3 class="text-sm text-gray-700 font-medium truncate">{{ product.name }}</h3>
                        <p class="mt-1 text-sm text-gray-500">{{ product.brand }}</p>
                        <div class="mt-2 flex items-center justify-between">
                            <p class="text-lg font-bold text-gray-900">$ {{ product.price }}</p>
                            <span v-if="product.discountPrice" class="text-sm text-red-500 line-through">$ {{ product.originalPrice }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const router = useRouter();
        const sortBy = ref('newest');

        onMounted(() => {
            store.fetchProducts();
        });

        const sortedProducts = computed(() => {
            const list = [...store.products];
            if (sortBy.value === 'price_asc') {
                list.sort((a, b) => a.price - b.price);
            } else if (sortBy.value === 'price_desc') {
                list.sort((a, b) => b.price - a.price);
            } else {
                list.reverse();
            }
            return list;
        });

        const goToDetail = (id) => {
            router.push('/product/' + id);
        };

        return {
            store,
            sortBy,
            sortedProducts,
            goToDetail
        };
    }
}
