import { onMounted, onUnmounted, ref, computed } from 'vue';
import store from '../store.js';

export default {
    template: `
        <div class="bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pb-24">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div class="space-y-6">
                        <p class="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-400">Footwear Manufacturing Studio</p>
                        <h1 class="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-black">
                            Focused on Footwear Mold Design and Quality Manufacturing
                        </h1>
                        <p class="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
                            We are a footwear company driven by real factory experience. From mold design and material selection to bulk production, every step is based on real production lines. Instead of chasing flashy concepts, we focus on stable materials, controllable production and reliable delivery.
                        </p>
                        <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span class="px-4 py-2 border border-gray-200 tracking-[0.2em] uppercase">Running / Sport</span>
                            <span class="px-4 py-2 border border-gray-200 tracking-[0.2em] uppercase">Women / Kids</span>
                            <span class="px-4 py-2 border border-gray-200 tracking-[0.2em] uppercase">Boots / Safety</span>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="aspect-[4/3] sm:aspect-[3/2] bg-gray-100 overflow-hidden">
                            <img
                                src="https://images.pexels.com/photos/6238030/pexels-photo-6238030.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Footwear mold design studio"
                                class="w-full h-full object-cover object-center"
                                loading="lazy"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div class="flex items-end justify-between mb-6 sm:mb-8">
                        <div>
                            <p class="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-400">Product Line</p>
                            <h2 class="mt-2 text-xl sm:text-2xl font-light text-black tracking-tight">From Running to Women’s Shoes, Full Category Coverage</h2>
                        </div>
                    </div>
                    <div v-if="store.loading" class="flex justify-center py-16">
                        <div class="animate-pulse flex space-x-2">
                            <div class="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                            <div class="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                            <div class="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                    <div v-else-if="products.length === 0" class="text-center py-16 text-gray-400 text-sm">
                        No product data yet.
                    </div>
                    <div
                        v-else
                        class="overflow-x-auto"
                        ref="productScroller"
                        @mouseenter="onScrollerHover(true)"
                        @mouseleave="onScrollerHover(false)"
                    >
                        <div class="flex space-x-6 sm:space-x-8 pb-4">
                            <router-link
                                v-for="product in products"
                                :key="product.id"
                                class="min-w-[210px] sm:min-w-[240px] lg:min-w-[260px] cursor-pointer"
                                :to="'/product/' + product.id"
                            >
                                <div class="relative w-full h-64 bg-gray-50 overflow-hidden mb-3 flex items-center justify-center">
                                    <img
                                        :src="product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x800/f9fafb/a3a3a3?text=Shoes'"
                                        :alt="product.name"
                                        class="max-h-full max-w-full object-contain object-center transition-transform duration-700 ease-out hover:scale-105"
                                        loading="lazy"
                                    >
                                </div>
                                <p class="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400">
                                    {{ product.category || product.brand || 'Shoes' }}
                                </p>
                                <p class="mt-1 text-sm text-black">{{ product.name }}</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-100 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
                        <div>
                            <p class="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-400">Factory</p>
                            <h2 class="mt-2 text-xl sm:text-2xl font-light text-black tracking-tight">Real Factory Production Lines</h2>
                            <p class="mt-3 text-sm text-gray-500 max-w-xl">
                                From cutting and stitching to lasting and packing, every pair of shoes is produced on real production lines. We prefer to show the factory as it is, rather than only cold 3D renders.
                            </p>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                v-for="image in factoryVisible"
                                :key="image.src"
                                class="aspect-[4/3] bg-gray-200 overflow-hidden"
                            >
                                <img
                                    :src="image.src"
                                    :alt="image.alt"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                >
                            </div>
                        </div>
                        <button
                            v-if="factoryImages.length > 1"
                            type="button"
                            class="absolute top-1/2 -translate-y-1/2 -left-10 md:-left-16 flex items-center justify-center text-gray-400 hover:text-black"
                            @click="prevFactory"
                        >
                            <span class="sr-only">Previous factory image</span>
                            <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            v-if="factoryImages.length > 1"
                            type="button"
                            class="absolute top-1/2 -translate-y-1/2 -right-10 md:-right-16 flex items-center justify-center text-gray-400 hover:text-black"
                            @click="nextFactory"
                        >
                            <span class="sr-only">Next factory image</span>
                            <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
                        <div>
                            <p class="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-400">Materials</p>
                            <h2 class="mt-2 text-xl sm:text-2xl font-light text-black tracking-tight">One-stop Footwear Materials Support</h2>
                            <p class="mt-3 text-sm text-gray-500 max-w-xl">
                                Uppers, outsoles, shoe inserts and special studded uppers can all be supplied and combined on demand, covering sporty, feminine, edgy and kids’ styles.
                            </p>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div
                                v-for="item in materialsVisible"
                                :key="item.image"
                                class="space-y-3"
                            >
                                <div class="aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        :src="item.image"
                                        :alt="item.alt"
                                        class="w-full h-full object-cover"
                                        loading="lazy"
                                    >
                                </div>
                                <div>
                                    <p class="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400">{{ item.label }}</p>
                                    <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            v-if="materialsItems.length > 1"
                            type="button"
                            class="absolute top-32 -left-10 md:-left-16 flex items-center justify-center text-gray-400 hover:text-black"
                            @click="prevMaterials"
                        >
                            <span class="sr-only">Previous material</span>
                            <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            v-if="materialsItems.length > 1"
                            type="button"
                            class="absolute top-32 -right-10 md:-right-16 flex items-center justify-center text-gray-400 hover:text-black"
                            @click="nextMaterials"
                        >
                            <span class="sr-only">Next material</span>
                            <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const productScroller = ref(null);
        const isHovering = ref(false);
        const atEnd = ref(false);
        const resumeAt = ref(0);
        let scrollTimer = null;

        const factoryStartIndex = ref(0);
        const materialsStartIndex = ref(0);

        onMounted(() => {
            store.fetchProducts();
            scrollTimer = setInterval(() => {
                if (isHovering.value) return;
                const el = productScroller.value;
                if (!el) return;
                const maxScroll = el.scrollWidth - el.clientWidth;
                if (maxScroll <= 0) return;

                if (el.scrollLeft >= maxScroll - 1) {
                    if (!atEnd.value) {
                        atEnd.value = true;
                        resumeAt.value = Date.now() + 2000;
                        return;
                    }
                    if (Date.now() < resumeAt.value) {
                        return;
                    }
                    el.scrollLeft = 0;
                    atEnd.value = false;
                    return;
                }

                atEnd.value = false;
                el.scrollLeft += 1;
            }, 40);
        });

        onUnmounted(() => {
            if (scrollTimer) {
                clearInterval(scrollTimer);
                scrollTimer = null;
            }
        });

        const products = computed(() => store.products || []);

        const factoryImages = computed(() => store.factoryImages || []);
        const materialsItems = computed(() => store.materialsItems || []);

        const factoryVisible = computed(() => {
            const list = factoryImages.value;
            if (list.length <= 3) return list;
            const result = [];
            for (let i = 0; i < 3; i++) {
                const idx = (factoryStartIndex.value + i) % list.length;
                result.push(list[idx]);
            }
            return result;
        });

        const materialsVisible = computed(() => {
            const list = materialsItems.value;
            if (list.length <= 4) return list;
            const result = [];
            for (let i = 0; i < 4; i++) {
                const idx = (materialsStartIndex.value + i) % list.length;
                result.push(list[idx]);
            }
            return result;
        });

        const onScrollerHover = (value) => {
            isHovering.value = value;
        };

        const prevFactory = () => {
            const len = factoryImages.value.length;
            if (len <= 1) return;
            factoryStartIndex.value = (factoryStartIndex.value - 1 + len) % len;
        };

        const nextFactory = () => {
            const len = factoryImages.value.length;
            if (len <= 1) return;
            factoryStartIndex.value = (factoryStartIndex.value + 1) % len;
        };

        const prevMaterials = () => {
            const len = materialsItems.value.length;
            if (len <= 1) return;
            materialsStartIndex.value = (materialsStartIndex.value - 1 + len) % len;
        };

        const nextMaterials = () => {
            const len = materialsItems.value.length;
            if (len <= 1) return;
            materialsStartIndex.value = (materialsStartIndex.value + 1) % len;
        };

        return {
            store,
            products,
            productScroller,
            onScrollerHover,
            factoryImages,
            factoryVisible,
            prevFactory,
            nextFactory,
            materialsItems,
            materialsVisible,
            prevMaterials,
            nextMaterials
        };
    }
}
