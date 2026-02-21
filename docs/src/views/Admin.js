import { onMounted, ref, reactive } from 'vue';
import store from '../store.js';

export default {
    template: `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Product Management</h1>
                <button @click="openForm()" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Add Product
                </button>
            </div>

            <!-- List -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in store.products" :key="product.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img class="h-10 w-10 rounded-full object-cover" :src="product.images && product.images[0] ? product.images[0] : 'https://placehold.co/100'" alt="">
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.brand }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button @click="copyProduct(product)" class="text-gray-600 hover:text-gray-900">Copy</button>
                                <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-10 space-y-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Homepage Visuals</h2>
                    <p class="text-sm text-gray-500 mb-6">Manage the images shown in the Factory and Materials sections on the home page.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-white shadow sm:rounded-lg p-4">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900">Factory Images</h3>
                                <button
                                    type="button"
                                    @click="addFactoryImage"
                                    class="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Add Image
                                </button>
                            </div>
                            <div class="space-y-3">
                                <div
                                    v-for="(img, idx) in store.factoryImages"
                                    :key="idx"
                                    class="flex flex-col space-y-2 border border-gray-100 rounded-md p-3"
                                >
                                    <div class="flex items-center space-x-3">
                                        <div class="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img v-if="img.src" :src="img.src" class="h-full w-full object-cover" alt="">
                                        </div>
                                        <div class="flex-1 space-y-1">
                                            <input
                                                v-model="img.src"
                                                type="text"
                                                placeholder="Image URL or leave blank when using upload"
                                                class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                            >
                                            <input
                                                v-model="img.alt"
                                                type="text"
                                                placeholder="Alt text"
                                                class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                            >
                                            <div class="flex items-center space-x-2">
                                                <label class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-[11px] text-gray-600 cursor-pointer bg-white hover:bg-gray-50">
                                                    <span>Upload</span>
                                                    <input type="file" accept="image/*" class="sr-only" @change="onFactoryFileChange(idx, $event)">
                                                </label>
                                                <span class="text-[10px] text-gray-400">Choose local image file</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            @click="removeFactoryImage(idx)"
                                            class="text-xs text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p v-if="store.factoryImages.length === 0" class="text-xs text-gray-400">
                                    No factory images configured yet.
                                </p>
                            </div>
                        </div>

                        <div class="bg-white shadow sm:rounded-lg p-4">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900">Materials Items</h3>
                                <button
                                    type="button"
                                    @click="addMaterialsItem"
                                    class="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Add Item
                                </button>
                            </div>
                            <div class="space-y-3">
                                <div
                                    v-for="(item, idx) in store.materialsItems"
                                    :key="idx"
                                    class="border border-gray-100 rounded-md p-3 space-y-2"
                                >
                                    <div class="grid grid-cols-1 gap-2">
                                        <div class="space-y-1">
                                            <input
                                                v-model="item.image"
                                                type="text"
                                                placeholder="Image URL or leave blank when using upload"
                                                class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                            >
                                            <div class="flex items-center space-x-2">
                                                <label class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-[11px] text-gray-600 cursor-pointer bg-white hover:bg-gray-50">
                                                    <span>Upload</span>
                                                    <input type="file" accept="image/*" class="sr-only" @change="onMaterialsFileChange(idx, $event)">
                                                </label>
                                                <span class="text-[10px] text-gray-400">Choose local image file</span>
                                            </div>
                                        </div>
                                        <input
                                            v-model="item.alt"
                                            type="text"
                                            placeholder="Alt text"
                                            class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                        >
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                v-model="item.label"
                                                type="text"
                                                placeholder="Label"
                                                class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                            >
                                            <input
                                                v-model="item.description"
                                                type="text"
                                                placeholder="Description"
                                                class="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-xs"
                                            >
                                        </div>
                                        <div class="flex justify-end">
                                            <button
                                                type="button"
                                                @click="removeMaterialsItem(idx)"
                                                class="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p v-if="store.materialsItems.length === 0" class="text-xs text-gray-400">
                                    No materials items configured yet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Modal -->
            <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeForm"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form @submit.prevent="submitForm" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h3>
                            
                            <div class="grid grid-cols-1 gap-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Name</label>
                                    <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Brand</label>
                                    <input v-model="form.brand" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Sizes</label>
                                    <input v-model="sizesInput" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="38,39,40,41,42">
                                    <p class="mt-1 text-xs text-gray-400">用逗号分隔多个尺码，例如：38,39,40,41,42</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                </div>
                                
                                <!-- Image Upload (Base64 for simplicity in this env) -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Images</label>
                                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div class="space-y-1 text-center">
                                            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <div class="flex text-sm text-gray-600">
                                                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple @change="handleFileUpload">
                                                </label>
                                                <p class="pl-1">or drag and drop</p>
                                            </div>
                                            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </div>
                                    <!-- Image Preview -->
                                    <div class="mt-2 grid grid-cols-3 gap-2">
                                        <div v-for="(img, idx) in form.images" :key="idx" class="relative h-20 w-20">
                                            <img :src="img" class="h-full w-full object-cover rounded">
                                            <button @click.prevent="removeImage(idx)" class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs">&times;</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                                    {{ isEditing ? 'Save Changes' : 'Add Product' }}
                                </button>
                                <button type="button" @click="closeForm" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const showForm = ref(false);
        const isEditing = ref(false);
        const form = reactive({
            id: null,
            name: '',
            brand: '',
            price: 0,
            originalPrice: 0,
            description: '',
            images: [],
            sizes: ['38', '39', '40', '41', '42'] // Default sizes
        });
        const sizesInput = ref('38,39,40,41,42');

        onMounted(() => {
            store.fetchProducts();
        });

        const openForm = () => {
            resetForm();
            isEditing.value = false;
            showForm.value = true;
        };

        const closeForm = () => {
            showForm.value = false;
        };

        const resetForm = () => {
            form.id = null;
            form.name = '';
            form.brand = '';
            form.price = 0;
            form.originalPrice = 0;
            form.description = '';
            form.images = [];
            form.sizes = ['38', '39', '40', '41', '42'];
            sizesInput.value = '38,39,40,41,42';
        };

        const editProduct = (product) => {
            form.id = product.id;
            form.name = product.name;
            form.brand = product.brand;
            form.price = product.price;
            form.originalPrice = product.originalPrice || 0;
            form.description = product.description;
            form.images = [...(product.images || [])];
            form.sizes = product.sizes || ['38', '39', '40', '41', '42'];
            sizesInput.value = (form.sizes || []).join(',');
            isEditing.value = true;
            showForm.value = true;
        };

        const deleteProduct = async (id) => {
            if (confirm('Are you sure?')) {
                await store.deleteProduct(id);
            }
        };

        const copyProduct = async (product) => {
            const cloned = {
                ...product
            };
            delete cloned.id;
            await store.addProduct(cloned);
        };

        const handleFileUpload = (event) => {
            const files = event.target.files;
            if (!files) return;

            // Upload via API
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const base64 = e.target.result;
                    // Upload to server
                    try {
                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ image: base64 })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            form.images.push(data.url);
                        }
                    } catch (err) {
                        console.error("Upload failed", err);
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        const removeImage = (index) => {
            form.images.splice(index, 1);
        };

        const submitForm = async () => {
            const parsedSizes = sizesInput.value
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
            form.sizes = parsedSizes.length > 0 ? parsedSizes : ['38', '39', '40', '41', '42'];
            const productData = { ...form };
            if (isEditing.value) {
                await store.updateProduct(form.id, productData);
            } else {
                delete productData.id;
                await store.addProduct(productData);
            }
            closeForm();
        };

        const addFactoryImage = () => {
            store.factoryImages.push({
                src: '',
                alt: ''
            });
        };

        const removeFactoryImage = (index) => {
            store.factoryImages.splice(index, 1);
        };

        const onFactoryFileChange = (index, event) => {
            const files = event.target.files;
            if (!files || !files[0]) return;
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                if (!result) return;
                if (!store.factoryImages[index]) return;
                store.factoryImages[index].src = result;
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        };

        const addMaterialsItem = () => {
            store.materialsItems.push({
                image: '',
                alt: '',
                label: '',
                description: ''
            });
        };

        const removeMaterialsItem = (index) => {
            store.materialsItems.splice(index, 1);
        };

        const onMaterialsFileChange = (index, event) => {
            const files = event.target.files;
            if (!files || !files[0]) return;
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                if (!result) return;
                if (!store.materialsItems[index]) return;
                store.materialsItems[index].image = result;
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        };

        return {
            store,
            showForm,
            isEditing,
            form,
            sizesInput,
            openForm,
            closeForm,
            editProduct,
            deleteProduct,
            copyProduct,
            handleFileUpload,
            removeImage,
            submitForm,
            addFactoryImage,
            removeFactoryImage,
            addMaterialsItem,
            removeMaterialsItem,
            onFactoryFileChange,
            onMaterialsFileChange
        };
    }
}
